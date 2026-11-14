import { describe, expect, it } from 'vitest';

/**
 * The six navigation rules from `conductor/tech-stack.md`, enforced rather than documented.
 * They run inside `bun run test`, and therefore inside `bun run verify`.
 *
 * Files are read through Vite's glob rather than `node:fs`, so this test needs no node types
 * and sees exactly the files the app bundle would see.
 */
/**
 * CSS modules are excluded: Vite hands back the module's export object rather than text for
 * `*.module.css` even under `?raw`. The guard below fails loudly if any other file is not text,
 * so nothing is skipped silently.
 */
const sources = import.meta.glob<string>(['./**/*.{ts,tsx,css,md}', '!./**/*.module.css'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

const MAP_PATH = 'src/MAP.md';
const ALLOWED_BARRELS = new Set(['src/content/lessons/index.ts']);
const CATCH_ALL = /^(utils|helpers|common|shared|misc)\.(ts|tsx)$/;
const MAX_LINES = 200;

/** Repo-relative path for every source file, plus its contents. */
const files: Array<{ path: string; text: string }> = Object.entries(sources).map(([key, text]) => ({
  path: `src/${key.replace(/^\.\//, '')}`,
  text,
}));

const directories = Array.from(
  new Set(
    files
      .map((file) => file.path.split('/'))
      .filter((segments) => segments.length > 2)
      .map((segments) => segments.slice(0, 2).join('/')),
  ),
).sort();

function section(markdown: string, heading: string): string {
  const match = new RegExp(`^## ${heading}$`, 'm').exec(markdown);
  if (match === null) return '';
  const rest = markdown.slice(match.index + match[0].length);
  const end = rest.search(/^## /m);
  return end === -1 ? rest : rest.slice(0, end);
}

describe('structure scan', () => {
  it('reads every scanned file as text, so no rule silently skips a file', () => {
    const nonText = Object.entries(sources as Record<string, unknown>)
      .filter(([, value]) => typeof value !== 'string')
      .map(([key]) => key);

    expect(nonText).toEqual([]);
  });
});

describe('structure rule 1 — no catch-all filenames', () => {
  it('has no utils, helpers, common, shared or misc modules', () => {
    const offenders = files
      .filter((file) => CATCH_ALL.test(file.path.split('/').pop() ?? ''))
      .map((file) => file.path);

    expect(offenders).toEqual([]);
  });
});

describe('structure rule 2 — no oversized source files', () => {
  it(`keeps every file at or under ${MAX_LINES} lines`, () => {
    const offenders = files
      .filter((file) => file.text.split('\n').length > MAX_LINES)
      .map((file) => `${file.path} (${file.text.split('\n').length} lines)`);

    expect(offenders).toEqual([]);
  });
});

/**
 * A barrel is a file that only re-exports. `narration/index.ts` is the narration factory — a module
 * that happens to be named `index` — so the rule is about barrelling, not about the filename.
 */
function isBarrel(text: string): boolean {
  const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const rest = withoutComments.replace(
    /export\s+(?:type\s+)?(?:\*(?:\s+as\s+\w+)?|\{[\s\S]*?\})\s+from\s+['"][^'"]+['"];?/g,
    '',
  );

  return rest.trim() === '';
}

describe('structure rule 3 — no barrels except the lesson order list', () => {
  it('has no re-export barrel outside the allowlist', () => {
    const offenders = files
      .filter((file) => file.path.endsWith('/index.ts') && !ALLOWED_BARRELS.has(file.path))
      .filter((file) => isBarrel(file.text))
      .map((file) => file.path);

    expect(offenders).toEqual([]);
  });

  it('recognises a barrel when it sees one', () => {
    expect(isBarrel("export { a } from './a';\nexport * from './b';\n")).toBe(true);
    expect(isBarrel("import { a } from './a';\nexport function b() {\n  return a;\n}\n")).toBe(
      false,
    );
  });

  it('keeps content independent of the app, games and screens', () => {
    const FORBIDDEN = /from '(?:\.\.\/)+(app|games|journey|lesson)\//;
    const offenders = files
      .filter((file) => file.path.startsWith('src/content/'))
      .filter((file) => FORBIDDEN.test(file.text))
      .map((file) => file.path);

    expect(offenders).toEqual([]);
  });
});

describe('structure rule 4 — lesson ids and audio', () => {
  it('names every lesson file after its id and resolves every clip', () => {
    const lessons = files.filter((file) =>
      /^src\/content\/lessons\/(?!index\.ts$)[^/]+\.ts$/.test(file.path),
    );
    const manifest = files.find((file) => file.path === 'src/content/audio-manifest.ts');

    for (const lesson of lessons) {
      const id = /id:\s*'([^']+)'/.exec(lesson.text)?.[1];
      const fileSlug = (lesson.path.split('/').pop() ?? '')
        .replace(/^\d+-/, '')
        .replace(/\.ts$/, '');
      const idSlug = (id ?? '').replace(/^lesson-/, '');

      expect(id, `${lesson.path} must declare an id`).toBeDefined();
      expect(idSlug, `${lesson.path} id must match its filename`).toBe(fileSlug);

      if (manifest === undefined) continue;
      for (const [, clipId] of lesson.text.matchAll(/clipId:\s*'([^']+)'/g)) {
        expect(manifest.text, `${clipId} is missing from the audio manifest`).toContain(
          `'${clipId}'`,
        );
      }
    }
  });
});

describe('structure rule 5 — game kinds resolve', () => {
  it('resolves every gameKind in the registry', () => {
    const lessons = files.filter((file) => file.path.startsWith('src/content/lessons/'));
    const registry = files.find((file) => file.path === 'src/games/registry.ts');

    for (const lesson of lessons) {
      for (const [, kind] of lesson.text.matchAll(/gameKind:\s*'([^']+)'/g)) {
        if (kind === undefined) continue;

        // Matches the registry entry whether or not the key is quoted, since the formatter
        // strips quotes from plain keys.
        expect(
          registry?.text,
          `src/games/registry.ts has no entry for game kind '${kind}'`,
        ).toMatch(new RegExp(`(?:^|[\\s{,])'?${kind}'?\\s*:`));
      }
    }
  });
});

describe('structure rule 6 — MAP.md covers every directory', () => {
  it('lists every directory under src/ and no directory that is gone', () => {
    const map = files.find((file) => file.path === MAP_PATH);
    expect(map, `${MAP_PATH} is missing`).toBeDefined();

    const listed = section(map?.text ?? '', 'Directories');
    for (const directory of directories) {
      expect(listed, `${directory}/ exists but is missing from MAP.md`).toContain(
        `\`${directory}/\``,
      );
    }

    for (const [, named] of listed.matchAll(/`(src\/[^`]+)\/`/g)) {
      expect(directories, `MAP.md names \`${named}/\`, which no longer exists`).toContain(named);
    }
  });
});
