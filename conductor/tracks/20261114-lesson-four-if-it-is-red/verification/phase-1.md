# Phase 1 — The plan can say "twice", and the road grows

- Track: 20261114-lesson-four-if-it-is-red
- Branch: feat/20261114-lesson-four-if-it-is-red
- Base / Head: d8654a8 / 7708862
- Date: 2026-11-14
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no output |
| static | `bun run lint` | 0 | Biome, 86 files checked, no fixes applied |
| static | `bun run build` | 0 | `dist/assets/index-CgV-NZmk.js` 239.03 kB / **75.02 kB gzip**, css 11.37 kB / 2.55 kB |
| unit | `bun run test` | 0 | **193 tests in 27 files** (182 at the base) |

`bun run verify` runs all four in order and exited 0.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-2 | Two repeated positions grow the route by three cells, each extra cell one step further in that arrow's direction | `src/world/path.test.ts` — "grows the route by one cell for every repeated step", "puts the extra cell one step further in that arrow's own direction", "repeats two adjacent steps on one arrow without merging them", "repeats the last step too" | pass |
| AC-3 | Each malformed repeat rule throws with the lesson's id, and every shipped lesson passes | `src/content/lesson.test.ts` — "the lesson contract — steps taken twice" (six cases: empty, duplicate, descending, step 0, past the end, and the accepted shapes) plus "passes every content lesson through the contract" | pass |
| AC-9 | Lessons 1–3 still route to `plan.length + 1` cells | `src/world/path.test.ts` — "leaves every lesson that names no repeat with one cell per step", run over the shipped `lessons` list | pass |

## Decisions taken

- **D2** — `GameSpec.twice?: readonly number[]`, positions counted from 1 like `flags`, validated at
  import by `assertTwice` with the lesson's id in every message.
- **D3** — `routeFor` applies the rule through `withRepeats`, so the route is expanded once, in the
  world, and every game inherits the same list.

## Evidence

- `src/content/lesson.ts` — the field, its doc comment, `assertTwice`, `assertLesson` call site
- `src/world/path.ts` — `routeFor` delegates to `withRepeats` + `tracePath`
- `src/content/lesson.test.ts`, `src/world/path.test.ts` — the tests named above

## Deviations

None. Only the four files in this phase's `Touches` changed.

## Notes

The first run of `bun run verify` in this phase exited 1 at the lint layer: Biome wants double quotes
for the test title containing an apostrophe. `bunx biome check --write` on the same four files fixed
the quoting, and the re-run exited 0 with the numbers above. No test was weakened, skipped or
deleted; the count rose 182 → 193.
