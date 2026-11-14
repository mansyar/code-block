# A road that reads as a road

## What

The road is no longer dots. Every tile on the route now draws its own half of the road, from its centre
outward to `calc(var(--cell) / 2 + var(--gap))`, so the band leaves the start pad, runs through every
tile in between and ends at the flag as **one unbroken line** — on all three shipped lessons.

- **The shape is the instruction.** A pre-literate child reads lesson 1's rule (`up, right, down` —
  never "down" first) and lesson 3's two legs from the road's geometry, because there are no words to
  read. Four dots joined by nothing did not say it; a continuous band does.
- **One thickness, one token.** `--road` is `10px` and every band takes it from there. `--gap` stays
  `0.75rem`, `--cell` and the cell-size formula in `Track.tsx` are untouched, so no tap target moved
  and the four-wide lesson keeps its 89 px cells (floor is 72 px).
- **Under the pictures, never on top of the finger.** The band sits at `z-index: 0` with the walker,
  the planned steps and the flags at `z-index: 1`, and it declines pointer events, so a tap on the
  strip over a planned step still removes that step.
- **Per-cell connections replace the global segment list.** `ribbon()` became
  `links(route, index) → ('up'|'right'|'down'|'left')[]`, derived from the previous and next cells;
  the DOM carries `data-link="up|right|down|left"` and the stylesheet has one rule per direction.
  A cell the route enters and leaves reports two connections and draws both through its centre; end
  cells report one; cells that are adjacent on the grid but not consecutive report none. A route that
  doubles back (lesson 3's second leg is the first reversed) draws one band, not two.
- **Nothing else changed.** No route data, no lesson wording, no new art, no new dependency. The
  lesson screens still show only `←` and the title, and the road layer stays `aria-hidden`.

## Why

Review round 1 of the lesson-three track found this (R1-2) and deferred it on purpose: the fix changes
shared geometry for lessons that were already shipped, which needed a decision that track did not
authorise. This track is that decision — D1 in [spec.md](./spec.md): the road runs *through* the
tiles, rather than only being widened inside the 12 px gap (a 16 px square is still a dot) or paid for
with a wider gap (at four columns that leaves 64 px cells, under the 72 px tap-target floor).

## Verification

`bun run verify` exit 0 — typecheck, Biome (86 files, no warnings), build `238.50 kB / 74.92 kB gzip`
against NFR-3's 200 kB, **182 tests in 27 files** (174 at the base). No dependency was added, and no
existing test was deleted, skipped or loosened.

Measured in a real browser (Playwright, dev server on `0.0.0.0:3000`) on all three lessons —
`verification/phase-2.md` has the tables and screenshots:

| Lesson | Cells | Cell size | Bands | Band size |
|---|---|---|---|---|
| 1 | 4 | 126 px | 6 | 10 × 75 px |
| 2 | 4 | 89 px | 6 | 10 × 56.5 px |
| 3 | 5 | 122.7 px | 8 | 10 × 73.3 px |

Every gap midpoint on every lesson is covered by a band, no sprite is crossed by one, and the sprites
hit-test above them. Review round 1 found that the band itself was still a hit target — a dead tap on
a planned step — so phase 3 makes it `pointer-events: none` and guards it with a test plus a browser
probe (same `elementFromPoint` now returns the step's `BUTTON`; clicking there takes the plan 2 → 0).

## Review

**PASS**, round 2, pinned to `41dadf5` — [review.md](./review.md). Round 1 was `FIXABLE` with one
Medium finding (R1-1, the dead tap), fixed and held by `src/world/road.test.tsx` and a measurement.
Rebased onto `main` after #5 merged; `git diff 41dadf5 HEAD -- src/` is empty, so the merged tree is
exactly the reviewed one.

## Evidence

`verification/phase-1.md` … `phase-3.md`, one per phase, each with the command output and an
acceptance mapping against AC-1 … AC-7.
