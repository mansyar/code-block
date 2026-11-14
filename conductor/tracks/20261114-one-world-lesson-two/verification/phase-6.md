# Phase 6 — evidence

**Goal:** every arrow moves the walker one cell in the direction it points, the whole road and its
flag are visible before the first tap, and both lessons play on that grid.

**Status:** verified
**Covers:** FR-9, FR-10, FR-11, AC-9, AC-10, AC-11, NFR-1
**Decisions:** D11, D12, D13, D14

## What the phase changed

| File | Change |
|---|---|
| `src/world/path.ts` | new — `Cell {col,row}`, `DELTA` for the three arrows, `tracePath`, `routeFor(lesson)`, `repeatRoute(step, times)`, `isStep` |
| `src/world/Goal.tsx` | new — the flag that marks the last cell; scenery, not a `PictureId` |
| `src/world/Track.tsx` | rewritten — lays the route out on a CSS grid, marks one goal, keeps `data-cell`/`data-step`/`data-walker` and adds `data-col`/`data-row`/`data-goal` |
| `src/world/Track.module.css` | rewritten — grid container, road cells, corner-mounted flag, direction-neutral arrival |
| `src/world/walk.ts` | reduced to `STEP_MS`; `cellsFor` is gone, the route owns the cell list |
| `src/games/sequence/SequenceGame.tsx` | draws `routeFor(lesson)`; a correct tap walks him one cell **along the road** |
| `src/games/repeat/RepeatGame.tsx` | draws `repeatRoute(card, 3)`; the road runs three cells in the arrow's own direction |
| `src/world/path.test.ts` | new — 5 tests |
| `src/games/sequence/SequenceGame.test.tsx` | +3 tests, and the cell count now reads from the route |
| `src/games/repeat/RepeatGame.test.tsx` | +1 test |
| `src/MAP.md`, `conductor/tech-stack.md`, `conductor/product.md` | the world is now a grid whose steps are directions |

## The rule this phase exists for

An arrow is a direction, not an ordinal. `step-up` moves the walker one cell up, `step-right` one
cell right, `step-down` one cell down — in every lesson, for every game kind. Lesson 1's solution is
therefore also its road:

```
(0,-1) --right--> (1,-1)        up, right, down
   ^                  |
   up                down
   |                  v
(0,0)              (1,0)  [goal]
```

Starting and ending on the same row is deliberate: a child who mixes up up and down ends visibly in
the wrong place rather than at the goal by accident.

## Tasks

- [x] **P6.T1: the grid** — covers: FR-9, D11
  - [x] **P6.T1.1:** `world/path.ts` with `Cell`, the three deltas, `tracePath`, `repeatRoute`
  - [x] **P6.T1.2:** a `walker` named as a route step throws with the lesson's id, not a silent guess
- [x] **P6.T2: the route comes from the lesson** — covers: FR-10, D12
  - [x] **P6.T2.1:** `routeFor(lesson)` traces the solution as directions, so road and answer cannot disagree
  - [x] **P6.T2.2:** lesson 1's route is `(0,0) (0,-1) (1,-1) (1,0)`, asserted in two places
- [x] **P6.T3: the road is visible, and it ends somewhere** — covers: FR-10, AC-9, D13, D14
  - [x] **P6.T3.1:** every route cell is drawn from the first render; one cell carries the goal flag
  - [x] **P6.T3.2:** a tap whose direction is not next moves nothing and still wobbles — the arrow never lies, the road simply is not there
- [x] **P6.T4: lesson 2 on the same grid** — covers: FR-11, AC-11, NFR-1
  - [x] **P6.T4.1:** `repeatRoute(card, 3)` runs the road three cells in the arrow's direction
  - [x] **P6.T4.2:** the arrival animation is direction-neutral, so an up or down step is not drawn as a sideways travel; reduced motion still swaps motion for colour
- [x] **P6.T5: tests and docs** — covers: AC-9, AC-10, AC-11
  - [x] **P6.T5.1:** 9 new tests: 5 for the grid, 3 for the sequence game's coordinates and goal, 1 for the repeat road
  - [x] **P6.T5.2:** `src/MAP.md`, `tech-stack.md` and `product.md` describe the grid and say an arrow means its direction

## Verification

Command: `bun run verify` (typecheck → lint → build → test)

| Stage | Result |
|---|---|
| typecheck | clean |
| Biome | 70 files, no fixes applied |
| build | `dist/assets/index-m0LuHt_d.js` — 233.28 kB / **73.15 kB gzip** (NFR-3 budget 200 kB) |
| tests | **119 passed, 18 files** (110 before this phase; +9 here) |

`FR-7` still holds through the change: the road is drawn, never described. The repeat game's whole
subtree is asserted to have empty `textContent` before, during and after the walk, and the sequence
game's ids appear only in `data-*` attributes.

## Deviations

- **Scope added by the parent, not by the plan.** The phase was authorized in-conversation after the
  parent played lesson 1 and asked for arrows that mean their direction; lesson 2 was included in the
  same instruction ("lesson 2 should be the same"). Recorded here because the original plan had five
  phases and no grid.
- `src/world/walk.ts` no longer exports `cellsFor`. Inside `Touches`, and its only consumer was the
  sequence game, which now reads the route's length.
