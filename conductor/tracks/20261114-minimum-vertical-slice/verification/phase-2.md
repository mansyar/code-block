# Phase 2 — Content contract and the journey map

- Track: 20261114-minimum-vertical-slice
- Branch: feat/20261114-minimum-vertical-slice
- Base / Head: ebfafe3 / 7474416
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no diagnostics |
| static | `bun run lint` | 0 | `biome check .` — 32 files, no diagnostics |
| static | `bun run build` | 0 | 28 modules, JS 224.29 kB / 70.40 kB gzip, CSS 3.57 kB |
| unit | `bun run test` | 0 | 42 passed across 7 files |
| composite | `bun run verify` | 0 | typecheck → lint → build → test, run after the last commit |

Test growth: 8 tests at the end of phase 1 → 42 now. No test was removed, skipped or loosened; the
only edits to existing tests were the Phase 1 scaffold test being replaced with the real start
screen assertions, and two fixes to the structural scanner described under Deviations.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| FR-1 | Opening the app shows the journey map | `src/App.tsx` renders `JourneyMap` from `initialScreen`; `src/App.test.tsx:9` asserts six nodes and no lesson heading | pass |
| FR-2 | Six ordered nodes; node 1 open, 2–6 locked, distinct by shape | `src/content/lessons/index.ts` (six `LessonCard`s); `src/progress/selectors.ts` unlock rule; `src/journey/JourneyMap.test.tsx:21` (disabled + `aria-disabled`) and `:34` (play vs lock marker) | pass |
| FR-3 | Activating node 1 opens lesson 1 with its three cards in a fixed, non-solution order | `src/journey/JourneyMap.test.tsx:43`, `src/lesson/LessonScreen.test.tsx:16`, `src/App.test.tsx:17` | pass |
| FR-9 | Corrupt or absent progress yields a fresh profile, never a crash | `src/progress/schema.test.ts` — 9 malformed inputs plus absent data all return `null`; `freshProgress` is the caller's fallback | pass (parser); store wiring is phase 5 |
| AC-1 | Six nodes and no other screen | `src/App.test.tsx:9` | pass |
| AC-2 | Nodes 2–6 non-activatable, locked marker a different shape | `src/journey/JourneyMap.test.tsx:21`, `:34` | pass |
| AC-3 | Three cards, order not the solution | `src/App.test.tsx:17`, `src/lesson/LessonScreen.test.tsx:16` asserts display order equals `cards` and differs from `solution` | pass |
| AC-9 | `"{"` and an unknown version both produce a fresh profile without throwing | `src/progress/schema.test.ts:29` | pass |
| NFR-6 | iPad Safari and Chrome, both orientations | fluid layout only: `JourneyMap.module.css` uses `repeat(auto-fit, minmax(88px, 1fr))`, `LessonScreen.module.css` wraps cards, no fixed pixel heights anywhere | pass by construction — no device available, not device-tested |

## Evidence

- 42 passing tests over 7 files (`bun run test`).
- `src/journey/JourneyMap.module.css`, `src/lesson/LessonScreen.module.css` — the fluid, tap-target
  sized layout behind NFR-2 and NFR-6.
- No screenshot: the app was not opened in a browser this turn; the rendered output was exercised
  through component tests only.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D2 | Audio manifest ships empty and `findClip` returns `undefined` for every line, which is the branch that keeps the system voice active | spec D2 |
| D4 | `code-block.progress.v1` = `{ version: 1, completed[], current }`; a star is a completed lesson; a stop is open at or before the furthest completed index + 1 | spec D4 |
| D6 | A discriminated-union reducer owns map and lesson; no URL routing; back is a UI button | spec D6 |

All three are mirrored in `.conductor/runs/20261114-minimum-vertical-slice/freebuff/decisions.md`
and in `pr.md` when the track ships.

## Deviations

- `src/App.test.tsx` — replaced the Phase 1 placeholder test with the real start-screen assertions;
  `Touches` names `src/App.tsx`, and a test for the new behaviour belongs beside it.
- `src/progress/schema.test.ts`, `src/progress/selectors.test.ts` — `Touches` names the two files,
  not the directory, so their tests sit just outside it.
- `src/MAP.md` — rule 6 requires every existing directory to be listed, and this phase creates six
  of them, so they moved from `## Planned` to `## Directories`.
- `src/structure.test.ts` — two fixes to the scanner, both required by this phase's own structure:
  (1) rule 4 crashed on `src/content/lessons/index.ts`, the barrel rule 3 mandates, so it now scans
  lesson files only; (2) Vite's `?raw` glob returns a module object for `*.module.css`, so CSS
  modules are excluded from the scan and a new guard test fails loudly if any other scanned file is
  not text, rather than letting a rule skip it silently. Neither change removes a rule.
- `src/test-setup.ts` (new) and one line in `vite.config.ts` — React Testing Library cannot register
  its own cleanup without globals, so tests in the same file accumulated previous trees and role
  queries matched duplicates. The setup file calls `cleanup` after each test.
- `conductor/tracks/20261114-minimum-vertical-slice/plan.md` — Phase 1's `Dependencies` now names
  `@types/react` and `@types/react-dom`, reconciling the gap disclosed in phase 1's evidence.

## Notes

- Lesson 1 deliberately omits `game.gameKind`: the sequence game does not exist yet, and the plan's
  P2.T7 describes a lesson screen that resolves an empty registry. Phase 3 adds the game, its
  registry entry, and that one field.
- `assertLesson` validates at module load, so a malformed lesson fails the test run naming itself
  rather than reaching a child as an unsolvable game.
- The map's markers are `play`, `star` and `lock` silhouettes, so state survives colour blindness
  and a greyscale screen.
- Scope: 18 files changed, ~600 changed lines excluding `bun.lock`, `conductor/` and `.conductor/`
  — inside the guard limits of 25 files and 800 lines.
