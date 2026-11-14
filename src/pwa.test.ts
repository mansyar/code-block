/**
 * Checks what `bun run build` actually produced (AC-8).
 *
 * Everything here reads `dist/`, so it only means anything after a build — `bun run verify` builds
 * before it tests, which is why the order in package.json is not negotiable.
 */
import { describe, expect, it } from 'vitest';

const distFiles = import.meta.glob('/dist/**/*', {
  query: '?url',
  eager: true,
  import: 'default',
}) as Record<string, string>;

const distText = import.meta.glob('/dist/**/*.{html,js,css,webmanifest,json}', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

const publicIcons = import.meta.glob('/public/icons/*.png', {
  query: '?url',
  eager: true,
  import: 'default',
}) as Record<string, string>;

type Manifest = {
  readonly name: string;
  readonly short_name: string;
  readonly theme_color: string;
  readonly background_color: string;
  readonly display: string;
  readonly orientation: string;
  readonly icons: readonly {
    readonly src: string;
    readonly sizes: string;
    readonly type: string;
  }[];
};

function textAt(name: string): string {
  const found = Object.entries(distText).find(([path]) => path.endsWith(`/dist/${name}`));

  if (found === undefined) {
    throw new Error(`dist/${name} is missing — run \`bun run build\` before the tests`);
  }

  return found[1];
}

function inDist(name: string): boolean {
  return Object.keys(distFiles).some((path) => path.endsWith(`/dist/${name}`));
}

describe('the built app is installable', () => {
  it('has a build to inspect', () => {
    expect(Object.keys(distFiles).length).toBeGreaterThan(0);
    expect(inDist('index.html')).toBe(true);
  });

  it('ships a manifest with the authored name, colours and standalone display', () => {
    const manifest = JSON.parse(textAt('manifest.webmanifest')) as Manifest;

    expect(manifest.name).toBe('Code Block');
    expect(manifest.short_name).toBe('Code Block');
    expect(manifest.display).toBe('standalone');
    expect(manifest.orientation).toBe('any');
    expect(manifest.theme_color).toBe('#f6c445');
    expect(manifest.background_color).toBe('#fdf8ef');
  });

  it('names both icons, and both are really in the build', () => {
    const manifest = JSON.parse(textAt('manifest.webmanifest')) as Manifest;

    expect(manifest.icons.map((icon) => icon.sizes)).toEqual(['192x192', '512x512']);

    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png');
      expect(icon.src.startsWith('/icons/')).toBe(true);
      expect(inDist(icon.src.slice(1))).toBe(true);
    }
  });

  it('keeps the committed PNGs the manifest points at', () => {
    const icons = Object.keys(publicIcons)
      .map((path) => path.split('/').pop())
      .sort();

    expect(icons).toEqual(['icon-192.png', 'icon-512.png']);
  });

  it('links the manifest and registers the service worker from the page', () => {
    const page = textAt('index.html');

    expect(page).toContain('rel="manifest"');
    expect(page).toContain('manifest.webmanifest');
    expect(page).toContain('registerSW.js');
    expect(textAt('registerSW.js')).toContain('serviceWorker.register');
  });
});

describe('the built app works offline', () => {
  it('precaches the shell, the app assets and the icons', () => {
    const worker = textAt('sw.js');

    expect(worker).toContain('index.html');
    expect(worker).toContain('manifest.webmanifest');
    expect(worker).toContain('icons/icon-192.png');
    expect(worker).toContain('icons/icon-512.png');
    expect(worker).toMatch(/assets\/index-[\w-]+\.js/);
    expect(worker).toMatch(/assets\/index-[\w-]+\.css/);
  });

  it('serves the shell for a navigation that has no cache entry', () => {
    expect(textAt('sw.js')).toContain('createHandlerBoundToURL');
  });

  it('keeps the precached payload far under the 1 MB budget', () => {
    const text = Object.values(distText).reduce((total, content) => total + content.length, 0);

    // Text assets only; the two PNG icons add a few kilobytes on top (NFR-5).
    expect(text).toBeLessThan(500_000);
  });
});
