# Phase 5 — Review Fixes (R1)

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base / Head: ab08c1a / 43a4614
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors |
| static | `bun run lint` (inside `bun run verify`) | 0 | 84 files checked, no fixes applied, no warnings |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-DFuk6gAe.js` 238.76 kB / 74.97 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 25 files, 174 tests passed (was 173) |
| all | `bun run verify` | 0 | the four stages above, in order — log: `.conductor/evidence/verify-phase5.log` |
| browser | Playwright against the dev server | — | see **Proof** |

## Item-by-item

| Plan item | Delivered | Where |
|---|---|---|
| P5.T1.1 | `Track` takes `wave?: number` — the route index of the flag that is waving — and marks only that cell `data-wave="true"`; a track that names none marks none | `src/world/Track.tsx`, `Track.module.css`; "waves only the flag the walker has just reached" |
| P5.T1.2 | `FLAG_BEAT_MS = 400` sits beside `STEP_MS` and `CELEBRATE_MS`, because the world owns its timings | `src/world/walk.ts` |
| P5.T1.3 | At flag 1 the plan stays on the road, the palette and GO stay inert, and the beat ends by clearing the plan and opening leg 2; the walker never moves | `src/games/plan/PlanGame.tsx` `onArrive`; "acknowledges flag 1 with a beat, then hands him a fresh plan there" |
| P5.T1.4 | Tests assert the beat (plan held, palette inert, wave on the reached flag) and that the last flag still uses the celebration | `PlanGame.legs.test.tsx`, `PlanGame.test.tsx`, `Track.test.tsx`, `App.lessonThree.test.tsx` |

## Proof (browser, not inference)

Sampled in Chromium at 740 ms (during the beat) and 1190 ms (after it):

| Sample | Flags | Walker | Plan on road | Palette |
|---|---|---|---|---|
| during beat | cell 2 `data-wave="true"`, animation `_wave_…`; cell 4 `data-wave="false"`, `none` | 2 | `step-up, step-right` still there | disabled |
| after beat | no wave on either flag | 2 | cleared | enabled |

Before this phase the same probe at 720/760/820/900/1100 ms returned `animation-name: none` on both
flags and a cleared plan on the arrival frame — which is the R1-1 finding, now fixed.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| FR-7 | An intermediate flag is a beat: the flag waves, the walker stays, the plan clears, the palette returns | browser proof above; the four tests named in P5.T1.4 | pass |
| R1-1 | The blocking finding from review round 1 | fixed as above; re-review carries it forward as `fixed` | fixed |

## Evidence

- `git diff 47a1615..43a4614 --stat` — 8 files: `walk.ts`, `Track.tsx`, `Track.module.css`,
  `Track.test.tsx`, `PlanGame.tsx`, both plan-game test files, `App.lessonThree.test.tsx`.
- Bundle 74.97 kB gzip (was 74.92), still far inside NFR-3's 200 kB.

## Decisions

None taken. This phase implements FR-7 exactly as `spec.md` words it; no fork in the phase needed a
`D<n>`.

## Deviations

None. Every changed path is inside this phase's `Touches`.

## Notes

Two verify runs: the first exited 0 but with one lint **warning** (`noDescendingSpecificity` on the
new `.cell[data-wave="true"] .goal` rule, which sat above the plainer `.goal`). Fixed by moving the
rule below `.goal` — the cascade is unchanged in effect and the linter's point was correct — then the
full verify was re-run and came back clean with no warning.

One test changed rather than being added: "walks the first leg on one press…" previously asserted the
plan was gone on the arrival frame. It now asserts the plan is still there during the beat and gone
after it — stricter than before, and the behaviour FR-7 asks for.
