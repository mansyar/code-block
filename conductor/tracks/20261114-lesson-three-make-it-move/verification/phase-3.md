# Phase 3 — The engine and the game, a leg at a time

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base / Head: ab08c1a / eef4d84
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors across the engine, the game and the road |
| static | `bun run lint` (inside `bun run verify`) | 0 | 82 files, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | 73.92 kB gzip (73.04 kB before this phase) |
| unit | `bun run test` (inside `bun run verify`) | 0 | 24 files, 168 tests passed (was 21 files, 147 tests) |
| all | `bun run verify` | 0 | the four stages above, in order |

## Item-by-item

| Plan item | Delivered | Where |
|---|---|---|
| P3.T1.1 | `runPlan(route, plan, { from, to, onStep, onHalt, onArrive })` walks while the plan's next step is the road's next cell, stops at the leg flag, at the end of the plan, or where the road does not continue | `src/world/run.ts` |
| P3.T1.2 | Returns a cancel function that clears every timer; `onArrive` fires at most once | `src/world/run.ts`; tests "cancels everything…", "walks the plan … arrives once" |
| P3.T2.1 | `PlanGame` renders the road with its flags, the palette, the GO pad and the current leg's plan on the road ahead of the walker | `src/games/plan/PlanGame.tsx`, `GoPad.tsx` |
| P3.T2.2 | Appending and removing are capped at the current leg's length; the walker's index survives a leg change, the plan does not | "plans a leg of two steps and refuses to plan past the flag", "takes a planned step back…", "hands him a fresh plan at flag 1…" |
| P3.T3.1 | GO runs the leg, is disabled while running, ignores a second press, and reports completion only from the last leg | "ignores a second press while a run is in flight", "walks the first leg … without reporting completion", "finishes at the last flag … exactly once" |
| P3.T3.2 | An intermediate arrival waves the flag, clears the plan, keeps the walker and leaves him editable; a wrong plan halts and reports nothing; unmounting cancels | "hands him a fresh plan at flag 1…", "halts where the road stops…", "cancels its timers when the lesson closes mid-run" |
| P3.T3.3 | Leg 2 is planned and run from the cell the walker stands on, so reusing leg 1's plan halts at once | "will not let the first leg's plan win the second: it halts at the flag" |
| P3.T4.1 | One registry entry maps `plan` to the component | `src/games/registry.ts` |
| P3.T5.1 | GO and the palette use `--tap-target`; both runs respect `prefers-reduced-motion: reduce` with colour in place of movement | `GoPad.module.css`, `PlanGame.module.css`, the walker's existing per-cell appearance |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-5 | Leg 1 accepts at most two planned steps, a third appends nothing, and removing takes the steps after it | `PlanGame.test.tsx` — "plans a leg of two steps and refuses to plan past the flag", "takes a planned step back, and every step after it" | pass |
| AC-6 | One GO press in leg 1 moves him exactly two cells, does not report completion, leaves him on cell 2 with an empty plan | "walks the first leg on one press…" and "hands him a fresh plan at flag 1…" | pass |
| AC-7 | Leg 2 plans `right, up` from the cell he reached, one press moves the last two cells and completes exactly once | "hands him a fresh plan…" (appends at cell 2, not cell 0) and "finishes at the last flag…" | pass |
| AC-8 | A plan that does not follow the road halts where the road stops, reports nothing, and stays editable | "halts where the road stops, keeping the plan so he can change it" (edits, presses again, arrives) and the leg-2 case | pass |
| FR-5 | Palette appends, a planned step removes itself and what follows, capped at the leg | `PlanGame.tsx` `add`/`removeAt`; both tests above | pass |
| FR-6 | One pad runs the current leg; one cell per `STEP_MS`; completion only after the last leg | `run.ts` plus the GO tests; the engine's own "walks a second leg from where the first one stopped" | pass |
| FR-7 | An intermediate flag waves, the plan clears, the walker stays, the palette returns | `PlanGame.tsx` `onArrive` branch; "hands him a fresh plan at flag 1…" | pass |
| FR-8 | A wrong plan runs literally and halts; nothing lost; the leg stays editable | `run.ts` `stepsThatFit`; the halt tests at engine and game level | pass |
| FR-11 | No lesson screen prints a sprite id or an instruction | "prints no words at all — the arrows and GO are the whole instruction" (`container.textContent === ''`); GO is a button with an accessible name and no visible text | pass |
| NFR-1 | Every tap responds within 100 ms; reduced motion keeps the same timing with colour | GO's `data-running`/`data-stuck` states; `GoPad.module.css` and `PlanGame.module.css` reduced-motion blocks | pass (motion not visually checked; see Notes) |

## Evidence

- `git diff 2fceec2..HEAD --stat` — 18 files changed, 1149 insertions(+), 73 deletions(-): `src/world/` (the engine, the ribbon split,
  the road and its tests, its CSS), `src/games/plan/` (six files), `src/games/registry.ts`.
- The engine is tested without React (`src/world/run.test.ts`, 7 tests), so the halt rule is proved on
  geometry rather than through a rendered component.
- Bundle 73.92 kB gzip, against NFR-3's 200 kB.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D1 | Plan-then-run in legs, one GO press per leg | spec D1 |
| D4 | A leg's plan is cleared at the flag; the walker is not | spec D4 |
| D5 | A wrong plan runs literally and halts where the road stops; no reset, no penalty | spec D5 |
| D6 | GO is a drawn control in `src/games/plan/`, not a `PictureId` | spec D6 |
| D7 | Append from the palette, remove by tapping a planned step; the road is the one place the plan lives | spec D7 |

## Deviations

- **P3.T4.1, split.** `GameKind` gained `'plan'` in phase 1 (disclosed there), because the union lives
  in `src/content/lesson.ts`, which phase 3 may not touch. Phase 3 delivered the half its `Touches`
  allows: the registry entry.
- **`src/world/Track.tsx`, two additions beyond the flag work.** `placed` widened to
  `readonly (PictureId | undefined)[]` so a plan written for the second leg can start at cell 2 with
  the cells behind it empty, and an `onClear` prop that renders a planned step as a button. Both are
  required by FR-5/FR-7 and both live inside `Touches` (`src/world/`).
- **`src/world/ribbon.ts` (new).** Extracting the ribbon geometry was the repair for structure rule 2:
  `Track.tsx` reached 206 lines once multi-flag and removal arrived. The code moved verbatim; no
  behaviour changed.

## Notes

`bun run verify` failed once, for one cause: structure rule 2 — `src/world/Track.tsx (206 lines)`.
The repair was the extraction above, not a trimmed comment or a raised cap, and the full verify then
passed with 24 files and 168 tests.

The phase's visual layer was **not** checked in a browser: there is no browser in this phase's path,
and the reduced-motion behaviour is asserted by CSS presence, not by rendering. Phase 4 is where the
lesson exists end to end; a human looking at the road is still the honest check for how the two flags
read.
