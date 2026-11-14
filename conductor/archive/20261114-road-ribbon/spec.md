# A road that reads as a road

## Problem

The road is a row of dots. `.track` sets `--gap: 0.75rem` (12 px) and `--road: 12px` while a cell is
117–126 px, and `ribbon()` draws a segment only inside the gap between two cells — so every stretch
of road is a **12 × 12 px square**, and lessons 1, 2 and 3 all read as a line of specks with tiles
floating beside them.

That matters more than a cosmetic wobble. The road's *shape* is how a pre-literate child reads the
route: lesson 1's rule (up, right, down — never "down" first) and lesson 3's two legs are both said
with geometry and no words. Four dots joined by nothing do not say it.

Found in review round 1 of `20261114-lesson-three-make-it-move` (R1-2) and deferred on purpose,
because the fix changes geometry that lessons already shipped and needed a decision that track did
not authorise. This track is that decision.

## Users

The four-year-old playing lessons 1–3, who must see where the road goes before he taps.

## Primary flow

He opens any of the three lessons. The road is one band leaving the start pad, running through every
tile on the route, and ending at the flag. He reads the route from it, and taps only cards whose
arrow points the way the band goes.

## Out of scope

- Route data, lesson order, lesson wording and the number of lessons.
- Tile size, the grid's gap, the cell-size formula, tap targets, the palette and the GO pad.
- New art, textures, gradients, outlines, shadows or animation on the road.
- Any dependency, and any browser test harness: `bun run verify` must keep running without Playwright.

## Functional requirements

- **FR-1** For every pair of consecutive cells on a route, the painted road spans from the centre of
  one cell to the centre of the other, with no break at either tile edge.
- **FR-2** The road is painted over the tile's surface and under its pictures (walker, planned step,
  flag), so no sprite is crossed by it.
- **FR-3** The band is one uniform thickness everywhere, taken from a single token, and equal at every
  cell size.
- **FR-4** A cell the route enters and leaves shows both connections meeting at its centre; a cell at
  either end of the route shows exactly one.
- **FR-5** Cells that are adjacent on the grid but not consecutive on the route stay unjoined:
  nothing is drawn between them.
- **FR-6** No size changes: cells keep their formula, the gap stays 12 px, and no tap target shrinks.
- **FR-7** No visible text is added anywhere: the lesson screens' text stays `←` and the lesson
  title, and the road stays out of the accessibility tree.

## Non-functional requirements

- **NFR-1** No dependency is added by any phase (carried over verbatim from the previous tracks).
- **NFR-2** Accessibility is unchanged: the road layer stays `aria-hidden`, adds no focusable element
  and no announced name; `prefers-reduced-motion` behaviour is untouched.
- **NFR-3** The bundle stays under 200 kB gzip (previous tracks' budget; last measured 74.97 kB).

## Acceptance criteria

| # | Criterion | Proves |
|---|---|---|
| AC-1 | On lessons 1, 2 and 3, every consecutive pair of cells has a band whose painted extent reaches at least `cell/2 + gap` from one centre toward the other, with no visible break — measured in the browser, numbers recorded in `verification/phase-2.md` | FR-1 |
| AC-2 | On each of the three lessons, the walker, the planned step and the flag paint above the band, and no screenshot shows a sprite crossed by it | FR-2 |
| AC-3 | The band's computed thickness is the same value on every segment of all three lessons, and it comes from one token | FR-3 |
| AC-4 | In unit tests, the route's interior cells report two connections and its end cells one, with the directions the route actually takes | FR-4 |
| AC-5 | In unit tests, no connection is reported between cells that are adjacent but not consecutive | FR-5 |
| AC-6 | `bun run verify` exits 0 with the existing tap-target and cell-size assertions passing unchanged | FR-6, NFR-1, NFR-3 |
| AC-7 | Each lesson screen's visible text is unchanged, and the road contributes nothing to the accessibility tree | FR-7, NFR-2 |

## Edge cases and failure modes

- **A route that turns.** Two bands meet at the corner cell's centre; they must overlap rather than
  miss by a pixel, so each band starts at the centre and runs outward (`cell/2 + gap` long).
- **A route that doubles back** (lesson 3's second leg is the first reversed). Two connections on the
  same side of a cell are the same band — the model must not draw it twice or thrash.
- **A one-cell route.** No connections; nothing drawn. No lesson has one today, and none should.
- **A four-wide route** (lesson 2). Its cells are the smallest in the project; the band must not
  change that, which is why the gap does not grow.
- **Reduced motion.** The band is static, so the setting changes nothing about it.
- **A band that is hard to read on grass or sky.** Recorded by the review, not solved by art (D3).

## Decisions

- **D1 — The road runs through the tiles.** Each cell draws its own connections as bands starting at
  its centre, so the road crosses every tile on the route instead of appearing only between them.
  *Rejected:* widening the gap so the between-tile stretch gets long (a four-wide road at `26rem`
  would leave 64 px cells, under the 72 px tap-target floor), and thickening the segment inside the
  12 px gap alone (a 16 px square is still a dot).
- **D2 — 10 px thick, 12 px gap, no size change.** `--road` becomes `10px`; `--gap`, `--cell` and the
  formula in `Track.tsx` are untouched. A review may move `--road` within 10–12 px if a measurement
  fails, and must record the final value.
- **D3 — The road stays one flat colour.** No outline, texture, gradient or shadow, and no palette
  token changes. If the band is indistinct on a surface, that is recorded as a finding for a later
  track rather than papered over with art.
- **D4 — The model is per-cell connections.** `ribbon()`'s global segment list is replaced by a
  function that answers, for one route and one cell index, which directions leave it; the DOM carries
  `data-link="up|right|down|left"`. `at()` stays, because the flag and the celebration are still
  positioned from the grid.
- **D5 — Base is the lesson-three branch.** `feat/20261114-lesson-three-make-it-move` @ `4fd0e62`:
  lesson three is open as PR #5 and this track touches the component it just changed. Rebasing onto
  `main` after #5 merges is a human step, not a phase.
- **D6 — The road stays out of the accessibility tree.** It keeps `aria-hidden`; no new role, name or
  focusable element.

## Open questions and assumptions

- None. Every choice above is made, and the measurements that could revise D2 are named in AC-1/AC-3.
