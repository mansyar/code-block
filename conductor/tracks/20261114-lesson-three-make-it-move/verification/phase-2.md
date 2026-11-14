# Phase 2 — The road can show more than one flag

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base / Head: ab08c1a / c84a19d
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors across the road and its tests |
| static | `bun run lint` (inside `bun run verify`) | 0 | 73 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist` bundle 73.04 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 21 files, 147 tests passed (was 143) |
| all | `bun run verify` | 0 | the four stages above, in order |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-4 | Lesson 3's road renders five cells at `(0,0) (0,-1) (1,-1) (2,-1) (2,-2)` with exactly two flags, on cells 2 and 4 | `src/world/Track.test.tsx` — "stands a flag at every leg boundary…" (cells 5, flags `['2','4']`) and "gives the two flags their own cells on the grid…" (`['1','-1']` and `['2','-2']`) | pass |
| FR-4 | The road is the plan read as directions, with a flag at every leg boundary | `Track` takes `goals?: readonly number[]` and marks each `data-goal`; `routeFor` already derives the cells from the plan | pass |
| — | A lesson with no legs still renders exactly one flag, at the end of its road | "keeps a single flag at the end when a lesson declares no legs", plus the pre-existing "draws the start and the goal as different pads" | pass |
| — | The celebration stays anchored to the last flag | "celebrates at the last flag, never at the intermediate one" — the burst is positioned from cell 4's column and row, not cell 2's | pass |
| — | Lessons 1 and 2 are unchanged on screen | their games pass no `goals`, so the default is the single-leg case; all 143 earlier tests pass unmodified | pass |

## Evidence

- `git diff 2fceec2..c84a19d --stat` — three files: `src/world/Track.tsx` (prop, derived flags,
  per-cell flag), `src/world/Track.test.tsx` (+4 tests), `src/world/Goal.tsx` (comment only).
- No CSS change was needed: `.cell[data-goal="true"]` already styles a pad, and both flags use it, so
  two destinations read as two places of the same kind.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D3 | Flags are route indices, passed per leg boundary; lesson 3 will pass `[2, 4]` | spec D3 |

## Deviations

- `src/world/Goal.tsx` — one doc comment. It said "a flag on the last cell of the route", which is now
  only true of the final leg. The component's behaviour is untouched; leaving the comment stale would
  have misled phase 3. Trivial and disclosed, outside the phase's `Touches`.

## Notes

No repair was needed: the focused run (`vitest run src/world/Track.test.tsx`, 9 tests) and the full
`bun run verify` both passed on their first attempt. The bundle moved 73.03 → 73.04 kB gzip, which is
the new prop and the `flags.includes` branch, well inside NFR-3's 200 kB.
