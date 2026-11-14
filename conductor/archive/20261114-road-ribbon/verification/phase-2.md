# Phase 2 — Prove it on all three lessons

**Status:** verified
**Branch:** `feat/20261114-road-ribbon`
**Decisions taken:** D2, D3, D5

## Verification command

```console
$ bun run verify
Checked 85 files in 112ms. No fixes applied.
dist/assets/index-CI_B7SQM.js   238.48 kB │ gzip: 74.91 kB
[2m Test Files [22m [1m[32m26 passed[39m[22m[90m (26)[39m
```

Exit code **0**, observed in this turn after the last edit. The build line and the full output are in
`.conductor/evidence/verify-p2-road.log`.

## Measurement method

The running app (`bun run dev` on `0.0.0.0:3000`, reached through the preview hostname), measured with
`getBoundingClientRect()` and `document.elementFromPoint()` in the page itself. For each lesson the
script read every `[data-link]` band and every `[data-cell]`, and checked:

- **thickness and length** of each band;
- **connections per cell**, in the route's directions;
- **continuity**, by testing whether a band covers the midpoint between each consecutive pair of cell
  centres — i.e. whether the road survives the gap *and* the tile edge;
- **painting order**, by hit-testing the centre of the walker, the flag and every planned step: the
  element under the pointer at that point must be the sprite (or inside it), never the band;
- **visible text** per screen, and that every band is `aria-hidden`.

## Lesson 1 — "Walk the path" (route `up, right, down`)

| Measure | Value |
|---|---|
| Cells | 4, each **126 × 126 px** |
| Bands | 6, each **10 px** thick, **75 px** long (63 + 12) |
| Connections per cell | `[up]`, `[down, right]`, `[left, down]`, `[up]` |
| Continuity at each gap | pairs 0-1, 1-2, 2-3 all covered |
| Walker above the band | yes (`elementFromPoint` → the walker's own `circle`) |
| Flag above the band | yes |
| Visible text | `← Walk the path` |

## Lesson 2 — "Do it again" (route `right, right, right`)

| Measure | Value |
|---|---|
| Cells | 4, each **89 × 89 px** — the narrowest road in the curriculum |
| Bands | 6, each **10 px** thick, **56.5 px** long (44.5 + 12) |
| Connections per cell | `[right]`, `[left, right]`, `[left, right]`, `[left]` |
| Continuity at each gap | pairs 0-1, 1-2, 2-3 all covered |
| Walker above the band | yes |
| Flag above the band | yes |
| Visible text | `← Do it again` |

Every band on this road reports top `174.5` and bottom `184.5`, so the half-bands of neighbouring
cells lie on exactly the same 10 px strip: the joins are invisible, not merely close.

## Lesson 3 — "Make it move" (route `up, right, right, up`, flags at 2 and 4)

Measured with two steps planned on the road (`step-up`, `step-right`), which is the screen that draws
pictures inside the cells the road crosses.

| Measure | Value |
|---|---|
| Cells | 5, each **122.7 × 122.7 px** |
| Bands | 8, each **10 px** thick, **73.3 px** long (61.35 + 12) |
| Connections per cell | `[up]`, `[down, right]`, `[left, right]`, `[left, up]`, `[down]` |
| Flags | cells 2 and 4, unchanged |
| Continuity at each gap | pairs 0-1, 1-2, 2-3, 3-4 all covered |
| Planned steps above the band | yes, 3/3 measured sprites |
| Walker above the band | yes |
| Visible text | `← Make it move` |

## Screenshots

- `.conductor/evidence/screens/road-lesson1-after.png`
- `.conductor/evidence/screens/road-lesson2-after.png`
- `.conductor/evidence/screens/road-lesson3-after.png`

All three show one band leaving the start pad, crossing every tile on the route and ending at the
flag — including lesson 3's two turns and its two flags.

## Acceptance criteria

| AC | Result |
|---|---|
| AC-1 — band reaches `cell/2 + gap` from a centre, no break | **met** on all three lessons; lengths 75, 56.5 and 73.3 px against half-cells of 63, 44.5 and 61.35 |
| AC-2 — walker, planned step and flag paint above the band | **met**, hit-tested on all three lessons |
| AC-3 — one uniform thickness from one token | **met**; every band on every lesson measures exactly 10 px, from `--road` |
| AC-7 — visible text unchanged, road out of the accessibility tree | **met**; text is `←` plus the lesson title, and every band carries `aria-hidden="true"` |

## Docs brought to the new model

| File | Change |
|---|---|
| `conductor/product-guidelines.md` | Visual language gains "The road is one drawn line": one band from the start pad through every tile to the flag, pictures on top, never dots in the gaps — the shape is the instruction. |
| `src/MAP.md` | `ribbon.ts` is described as answering which sides of a cell the route leaves by, so the band runs through the tiles rather than only in the gaps. |

## Notes and limits

- No size changed: cells measure 126, 89 and 122.7 px exactly as before this track, the gap is still
  12 px, and the 72 px tap-target tests pass unchanged (FR-6).
- `--road` stayed at **10 px**; no tuning was needed (P2.T3 not triggered).
- What was **not** measured: how the band looks on a real tablet at other zoom levels or with system
  text scaling, and reduced motion (the band is static, so the setting cannot affect it).
- The lesson screens were driven through the map with progress seeded in `localStorage`; nothing was
  completed, so no star or unlock state was exercised here (that is lesson three's territory, already
  verified in `20261114-lesson-three-make-it-move`).
