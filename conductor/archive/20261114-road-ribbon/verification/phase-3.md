# Phase 3 — Review Fixes (R1)

**Status:** verified
**Branch:** `feat/20261114-road-ribbon`
**Finding fixed:** R1-1 (Medium)
**Decisions taken:** none — the fix is the one the finding names.

## Verification command

```console
$ bun run verify
Checked 86 files in 86ms. No fixes applied.
dist/assets/index-HffeIb5E.js   238.50 kB │ gzip: 74.92 kB
 Test Files  27 passed (27)
      Tests  182 passed (182)
```

**Exit code: 0**, observed in this turn after the final edit. Log: `.conductor/evidence/verify-p3-road.log`.

## The finding, restated

`.link` is a positioned element, and a positioned element paints above the cell's static content. So
the band was the topmost target along a 10 px strip crossing the cell, and a tap that landed there
over a planned step hit the band instead of the step's button: **a dead tap**, which the product
guidelines forbid ("a tap that does nothing is indistinguishable from a broken app").

Measured in review round 1 on lesson 3, cell 0: `elementFromPoint` on the band inside the planned
cell returned the band `SPAN`.

## The fix

| File | Change |
|---|---|
| `src/world/Track.tsx` | Each band span declares `pointer-events: none` inline, with the reason next to it. |
| `src/world/road.test.tsx` | **New** — holds the fix: every band on a two-flag road reports `pointer-events: none`, and the planned step in the walker's cell still has its own button. |

The property lives on the element rather than in `Track.module.css` because a stylesheet is not
reachable from a test: CSS modules cannot be read as text through Vite's glob, and `?inline` comes
back empty under Vitest. Two attempts to guard the stylesheet failed on exactly that and were
abandoned rather than left as a test that cannot fail:

1. `node:fs` — rejected by `tsc` (the project has no node types, by design).
2. `./Track.module.css?inline` — typechecked, but the string was empty at runtime, so the guard
   asserted against `''`.

With the declaration on the element, jsdom can see it, so the guard is real.

## Evidence in the browser (P3.T3)

Lesson 3 with two steps planned, on the dev server, before and after the fix:

| Probe | Before | After |
|---|---|---|
| `elementFromPoint` on the band inside the planned cell | `SPAN` (the band) | `BUTTON` (the step's control) |
| Cell 0 | band | `BUTTON`, inside the control |
| Cell 1 | — | `BUTTON`, inside the control |
| Clicking that point | nothing happened | the step was removed (2 planned steps → 0) |

The second probe point was corrected first: an earlier attempt sampled 6 px from the band's end,
which falls outside the tile and hit a container `DIV`, proving nothing. Both reported points are
inside the tile (`insideCell: true`) and at least 30 px from the centre, so they are off the arrow
sprite too.

## Acceptance

| Item | Result |
|---|---|
| R1-1 fixed | **yes** — the band declines the tap, measured in the browser and held by a test |
| No test weakened, skipped or deleted | **yes** — 180 tests before the phase, 182 after |
| No dependency added | **yes** — no lockfile or `package.json` change |
| Structure rule (200 lines) | **yes** — `Track.tsx` 168, `road.test.tsx` 47, `ribbon.test.ts` 30 |
| FR-6 untouched | **yes** — no route data, size, gap, tap target or lesson wording changed by this phase |

## Deviation

`src/world/road.test.tsx` is new and was not among this phase's `Touches`. The fix needed a home for
its guard, and adding a third test to `Track.test.tsx` would have pushed it past the 200-line rule;
splitting at the real cause was the alternative to trimming another file's tests.
