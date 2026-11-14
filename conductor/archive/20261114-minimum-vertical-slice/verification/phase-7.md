# Phase 7 — Review Fixes (R1)

- Track: 20261114-minimum-vertical-slice
- Branch: feat/20261114-minimum-vertical-slice
- Base / Head: dcfaaf5 / a62d605
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no diagnostics |
| static | `bun run lint` | 0 | `biome check .` — 56 files, no diagnostics |
| static | `bun run build` | 0 | JS 230.52 kB / 72.24 kB gzip; 10 precache entries (237.13 KiB) |
| unit | `bun run test` | 0 | 92 passed across 14 files |
| composite | `bun run verify` | 0 | typecheck → lint → build → test, at a62d605 |

Test growth 90 → 92. No test was removed, skipped or loosened.

## What changed

- **R1-1 (High) — the star is earned by finishing the game.** `LessonScreen` now reports
  completion to the shell at the moment the game finishes (`finishGame` = open the concept beat +
  `onComplete()`), and the concept beat's "done" only leaves the screen via `onClose`. `App`'s
  handler records and no longer closes, so the two are independent. A child who taps the header
  back control straight after finishing the game now lands on a map that already shows the star
  and the opened second stop. The store was already idempotent, so "done" after completion records
  nothing twice.
- **R1-2 (Medium) — the locked node's number clears the text floor.** `.node[data-state="locked"]`
  uses `--colour-ink` instead of `--colour-ink-muted`: **7.35:1** on `--colour-lock` instead of
  3.58:1, past NFR-2's 4.5:1. The border stays dashed and the marker stays a lock, so the state is
  still carried by shape as well as colour.

## Acceptance

| ID | Finding | Evidence | Status |
|---|---|---|---|
| R1-1 | Star recorded by completing the game, not by pressing done | `src/App.test.tsx` "keeps the star when the child leaves by the back control instead of done" (new); `src/lesson/LessonScreen.test.tsx` "reports the lesson complete as soon as the game is finished" (new) and "leaves the screen from the done control without reporting twice" | fixed |
| R1-2 | Locked node text ≥ 4.5:1 | `src/journey/JourneyMap.module.css:39`; ratio recomputed from the token values: 7.35:1 (was 3.58:1) | fixed |

The R1-1 test is the regression test for the finding: against the previous wiring the back control
left `completeLesson` uncalled, so no star appeared and node 2 stayed locked.

## Decisions

None — both fixes are corrections to existing behaviour, not choices. No `D<n>` is involved, and
no entry was added to `decisions.md`.

## Deviations

None. Every changed file is inside the phase's `Touches`.

## Notes

- The contrast figure is computed from the token hex values with the WCAG relative-luminance
  formula and recorded here; jsdom cannot read stylesheets, and a token-level contrast test is
  recorded as debt (R1-3 in the round-1 review) rather than invented here.
- Scope: 5 files changed, well inside the 25 file / 800 line guard.
- Not changed: the concept beat still shows before the map, so the child still hears why the order
  mattered; only the moment the star is written moved.
