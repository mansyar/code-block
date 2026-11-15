# Phase 2 — A red pad, and a walk that obeys it

- Track: 20261114-lesson-four-if-it-is-red
- Branch: feat/20261114-lesson-four-if-it-is-red
- Base / Head: d8654a8 / 9df492b
- Date: 2026-11-14
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no output |
| static | `bun run lint` | 0 | Biome, 90 files checked, no fixes applied |
| static | `bun run build` | 0 | `dist/assets/index-BxJHXWV7.js` 241.66 kB / **75.69 kB gzip**, css 12.38 kB / 2.67 kB |
| unit | `bun run test` | 0 | **202 tests in 29 files** (193 after phase 1) |

`bun run verify` runs all four in order and exited 0.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-4 | One `data-pad="red"` cell per repeated position, each carrying the pad's own silhouette, and none on a lesson without a repeat | `src/games/condition/ConditionGame.test.tsx` — "marks the tile a repeat happens on, with a shape of its own" (`padCells() === [3]`, one `[data-repeat="true"]`) and "draws no pad at all for a lesson that names no repeat" (renders `RepeatGame` with lesson 2) | pass |
| AC-5 | A pad's step advances two route indices in two beats; a plain step advances one index in one beat | `src/games/condition/ConditionGame.test.tsx` — "walks two cells for the padded arrow and one for every other": walker at 1 after one beat, 2 then 3 after the pad's two, 5 at the end with `onComplete` once | pass |
| FR-7 | A planned arrow can be taken back with everything after it, and the plan stays editable after a halt | "takes a planned arrow back, and everything planned after it"; "halts where the road stops, keeps the plan, and stays editable" | pass |
| NFR-3 | The budget holds | 75.69 kB gzip against 200 kB | pass |
| NFR-5 | The new kind resolves, files stay under 200 lines | `src/games/registry.ts` entry; `Track.tsx` 180, `run.ts` 180, `ConditionGame.tsx` 145, `spans.ts` 94, `ConditionGame.test.tsx` 126 | pass |

## Decisions taken

- **D1** — the pad repeats the step: the walk takes two cells, two beats.
- **D4** — the pad is a pad, not a picture: `data-pad="red"` plus a rotated square child in
  `Track.module.css`, using the existing `--colour-berry` token and declining pointer events.
- **D5** — one new game kind, `condition`, beside `plan`, rather than a second rule inside
  `PlanGame`.

## Evidence

- `src/world/Track.tsx`, `src/world/Track.module.css` — the `pads` prop, the diamond, and why the pad
  never takes a tap
- `src/world/run.ts`, `src/world/road-run.test.ts` — `runRoad`, its beats, halts, start position and
  cancellation
- `src/games/condition/spans.ts` — plan step → route cells (`spansFor`, `padIndices`, `reachOf`)
- `src/games/condition/ConditionGame.tsx` (+ `module.css`, `.test.tsx`), `src/games/registry.ts`

## Deviations

- **`src/world/road-run.test.ts` — a new file outside this phase's `Touches`.** The `runRoad` tests
  were first added to `run.test.ts`, which took it to 201 lines and failed structure rule 2 (200-line
  cap). They were moved into their own file, and `run.test.ts` is back to its original 134 lines with
  its original tests untouched. No test was removed, skipped or loosened.

## Notes

Two defects were found and fixed inside this phase, both caught by the tests rather than by reading:

1. `tsc` rejected `spansFor(solution, …)` because `solution` is `readonly PictureId[]`; the game now
   filters it with `isStep`, exactly as `routeFor` does, so a plan naming the walker cannot slip
   through.
2. `placed` indexed the span list by **route** index, so on a padded road every arrow after the
   repeat sat one cell early. It now maps route cell → plan index explicitly (`byCell`), and the
   removal test proves the arrow on the pad's tile truncates the plan at the right place.
