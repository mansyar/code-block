# Phase 1 — Scaffold and the verify loop

- Track: 20261114-minimum-vertical-slice
- Branch: feat/20261114-minimum-vertical-slice
- Base / Head: ebfafe3 / 941880d
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no diagnostics |
| static | `bun run lint` | 0 | `biome check .` — 14 files, no diagnostics |
| static | `bun run build` | 0 | vite 8.3.8, 17 modules, JS 219.74 kB / 68.69 kB gzip |
| unit | `bun run test` | 0 | 8 passed across 2 files (`App.test.tsx`, `structure.test.ts`) |
| composite | `bun run verify` | 0 | typecheck → lint → build → test, ~1.6 s plus build |

Installed versions, frozen in `bun.lock`: react 19.3.1, react-dom 19.3.1, vite 8.3.8,
@vitejs/plugin-react 6.3.0, typescript 7.0.2, @biomejs/biome 2.6.7, vitest 5.1.0, jsdom 31.0.1,
@testing-library/react 16.3.3, @testing-library/jest-dom 7.0.1 — the current stable release of
each, per D-TS8.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| FR-1 | Opening the app shows the journey map | shell renders: `src/App.test.tsx:7`; the map itself is deferred to phase 2, which also covers FR-1 | partial (deferred, named) |
| NFR-4 | `bun run verify` completes within 60 s | full run under 2 s on a warm install | pass |

## Evidence

- `src/structure.test.ts` — rules 1–3 active and passing; rules 4–5 vacuous while `src/content/`
  is empty; rule 6 active against `src/MAP.md` and passing.
- `dist/` build output (gitignored) — the production build the test command follows.
- No screenshot: the phase changes no visible behaviour beyond a placeholder heading.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| — | None taken this phase | `Decisions: none` |

## Deviations

- `src/App.test.tsx` — the render test required by P1.T5; `Touches` names `src/App.tsx` but not its
  test file. No behaviour change.
- `@types/react`, `@types/react-dom` — installed, but **not listed in this phase's `Dependencies`**.
  TypeScript cannot type a React project without them: `bun run typecheck` failed with TS7016 and
  TS7026 before they were added. They are declaration files for already-approved packages and add
  no runtime code, so the phase was continued rather than stopped; flagged here for review, and
  they should be added to the plan's `Dependencies` for any later phase that needs them.
- `biome.json` — the first `bun run format` reformatted Markdown, including `conductor/` state
  files and `README.md`, which are outside `Touches`. Those changes were restored in the same turn
  (`git restore`) and the config now scopes Biome to code files, so the final diff contains none
  of them.

## Notes

- `bun run icons` (part of P1.T1.1) is deferred to phase 6, where `scripts/generate-icons.ts`
  exists (P6.T1). The target file does not exist yet, so registering the script now would ship a
  broken command.
- Rule 6 reads only the `## Directories` section of `src/MAP.md`; the `## Planned` section
  documents the intended tree and is deliberately not validated, so later phases add directories
  without editing the map or tripping the rule.
- Build size 68.69 kB gzip JavaScript, well inside the 200 kB budget in NFR-5, though the real
  measurement belongs to phase 6.
