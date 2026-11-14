# Phase 1 — The road runs through the tiles

**Status:** verified
**Branch:** `feat/20261114-road-ribbon`
**Decisions taken:** D1, D2, D3, D4, D6

## Verification command

```console
$ bun run verify
Checked 85 files in 88ms. No fixes applied.
dist/assets/index-CI_B7SQM.js   238.48 kB │ gzip: 74.91 kB
 Test Files  26 passed (26)
      Tests  180 passed (180)
```

**Exit code: 0.** Typecheck, Biome (85 files, no warnings), build and tests all passed in this turn;
the log is `.conductor/evidence/verify-p1-road.log`.

## What changed

| File | Change |
|---|---|
| `src/world/ribbon.ts` | `ribbon()` (a global segment list spanning the gap) is replaced by `links(route, index)`, which answers the sides one cell's half of the road leaves by. `at()` stays for the flag and the sparks. |
| `src/world/Track.tsx` | The global road layer is gone; each cell renders one `data-link` span per connection before its pictures, `aria-hidden` (D6). |
| `src/world/Track.module.css` | `--road` becomes `10px`; `.link` plus four `[data-link]` rules draw a band from the cell's centre to `calc(var(--cell) / 2 + var(--gap))` outward; `.goal` and `.step` are lifted to `z-index: 1` so the pictures sit on the road, never under it. |
| `src/world/Track.test.tsx` | The two ribbon tests are replaced by per-cell connection tests: lesson 1's four sides, a straight road, a two-flag road, and the unjoined shortcut between lesson 1's first and last cells. |
| `src/world/ribbon.test.ts` | **New** — the pure `links()` cases (a turn, both ends, an index the route does not have, a road that doubles back on one side). |

No route data, tile size, gap, cell-size formula, tap target or lesson wording was touched (FR-6).

## Evidence of the connections (AC-4, AC-5)

Unit tests, all passing:

- Lesson 1 (`up, right, down`), sides per cell `[up]`, `[down, right]`, `[left, down]`, `[up]` — two
  on each interior cell, one on each end, in the route's real directions.
- Cells 0 and 3 touch on the grid but are not consecutive: neither answers toward the other, so the
  shortcut is still not drawn.
- Lesson 3's two-leg road: `[up]`, `[down, right]`, `[left, right]`, `[left, up]`, `[down]` — both
  legs are joined, not just the one the walker stands on.
- A road that comes back along the side it left by answers one band, not two.

## Evidence in the running app (sanity check, not the phase-2 measurement)

Dev server, lesson 1, measured in the browser:

| Measure | Value |
|---|---|
| Cells | 4, each **126 × 126 px** |
| Bands | 6, each **10 px** thick |
| Band length | **75 px** = cell/2 (63) + gap (12) |
| Directions by cell | `[up]`, `[down, right]`, `[left, down]`, `[up]` |
| Continuity | the band runs from the walker's cell centre up, across the top row, and ends at the goal cell's centre — no break at any tile edge |

Screenshot: `.conductor/evidence/screens/road-lesson1-after.png`. All three lessons are measured in
phase 2 (AC-1..AC-3).

## Deviations

- **`src/world/ribbon.test.ts` is new and was not in this phase's `Touches`.** Moving the pure
  `links()` cases there was necessary: with them in `Track.test.tsx` that file reached 209 lines and
  failed structure rule 2 (200 lines), and the component-level tests alone are the right subject for
  the component's test file.
- One expectation in the new `links()` test was wrong on first run (the turn's first side is `left`,
  not `right`) and one fixture doubled back onto the cell itself; both were corrected in the test,
  not worked around in the code. The three failures seen during the phase — structure rule 2, that
  expectation, and that fixture — were all fixed at their cause and `bun run verify` was re-run to 0.

## Task map

| Task | Status |
|---|---|
| P1.T1 answer connections per cell | done |
| P1.T2 draw the bands inside the cell | done |
| P1.T3 style the band | done |
| P1.T4 test the connections | done |
| P1.T5 prove nothing resized | done — cell-size and tap-target tests unchanged and passing |
