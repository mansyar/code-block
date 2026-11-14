# Plan — A road that reads as a road

> **Autonomy:** ready

Two phases. Phase 1 changes how the road is drawn and proves it in tests; phase 2 proves it in a
browser on all three shipped lessons and brings the docs to the new model. No phase adds a
dependency (NFR-1), and no phase touches lesson data.

---

## Phase 1 — The road runs through the tiles

**Goal:** Replace the gap-only ribbon with per-cell connections, drawn inside each cell beneath its
pictures, so consecutive cells are joined by an unbroken band.

**Depends on:** none
**Covers:** FR-1, FR-2, FR-3, FR-4, FR-5, NFR-2, NFR-3
**Touches:** `src/world/ribbon.ts`, `src/world/Track.tsx`, `src/world/Track.module.css`, `src/world/Track.test.tsx`
**Dependencies:** none
**Decisions:** D1, D2, D3, D4, D6
**Verification:** `bun run verify`

- [x] **P1.T1: Answer connections per cell** — `ribbon.ts` exports the directions leaving a cell
  (`up`/`right`/`down`/`left`) for a route and an index, deriving them from the previous and next
  cell; `at()` and the segment type stay only if something still uses them. — covers: FR-4, FR-5
- [x] **P1.T2: Draw the bands inside the cell** — `Track.tsx` renders one `data-link` element per
  connection inside each cell, before the pictures, and drops the global road layer. — covers: FR-1, FR-2
- [x] **P1.T3: Style the band** — `.link` is `--road: 10px` thick, `calc(var(--cell) / 2 + var(--gap))`
  long from the centre in its direction, at `z-index: 0`, with the pictures at `z-index: 1`; `--cell`,
  `--gap` and the cell-size formula are unchanged. — covers: FR-1, FR-2, FR-3, FR-6
- [x] **P1.T4: Test the connections** — unit tests assert, for lessons 1–3, that interior cells report
  two connections and end cells one, in the route's actual directions, and that no connection exists
  between cells that are adjacent but not consecutive. — covers: FR-4, FR-5
- [x] **P1.T5: Prove nothing resized** — the tap-target, cell-size and lesson tests pass unchanged;
  the bundle stays under budget. — covers: FR-6, NFR-2, NFR-3

**Status:** verified

---

## Phase 2 — Prove it on all three lessons

**Goal:** Measure the road in a real browser on lessons 1, 2 and 3, record the numbers, and bring
`product-guidelines.md` and `MAP.md` to the per-cell model.

**Depends on:** Phase 1
**Covers:** FR-1, FR-2, FR-3, FR-7, NFR-1, AC-1, AC-2, AC-3, AC-7
**Touches:** `src/world/Track.module.css`, `conductor/product-guidelines.md`, `src/MAP.md`, `conductor/tracks/20261114-road-ribbon/verification/phase-2.md`
**Dependencies:** none
**Decisions:** D2, D3, D5
**Verification:** `bun run verify`

- [x] **P2.T1: Measure the band on all three lessons** — for every consecutive pair, the band's
  painted extent and thickness, and the painting order between band and sprites; screenshots taken
  and kept as evidence. — covers: AC-1, AC-2, AC-3
- [x] **P2.T2: Confirm the screens did not change otherwise** — visible text per lesson is still `←`
  and the title, the road is absent from the accessibility tree, and reduced motion still behaves. —
  covers: FR-7, NFR-2, AC-7
- [x] **P2.T3: Tune only if a measurement fails** — `--road` may move between 10 and 12 px; the final
  value and the reason go in the evidence file. — covers: FR-3, AC-3
- [x] **P2.T4: Update the docs** — `product-guidelines.md` states the road-through-the-tiles rule and
  `MAP.md` describes per-cell connections instead of a global ribbon. — covers: FR-1
- [x] **P2.T5: Write the evidence file** — `verification/phase-2.md` holds the measurement table for
  all three lessons, the screenshot paths and the files changed. — covers: AC-1, AC-2, AC-3

**Status:** verified

---

## Acceptance map

| AC | Phase | Proof |
|---|---|---|
| AC-1 | 2 | P2.T1 measurements in `verification/phase-2.md` |
| AC-2 | 1, 2 | P1.T3 layering + P2.T1 painting order and screenshots |
| AC-3 | 1, 2 | P1.T3 single token + P2.T1/T3 measured thickness |
| AC-4 | 1 | P1.T4 |
| AC-5 | 1 | P1.T4 |
| AC-6 | 1 | `bun run verify` in phase 1 |
| AC-7 | 2 | P2.T2 |

**Total:** 2 phases, 10 tasks.
