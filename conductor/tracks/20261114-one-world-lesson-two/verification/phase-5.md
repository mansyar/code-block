# Phase 5 — The docs catch up with the world

- Track: 20261114-one-world-lesson-two
- Branch: feat/20261114-one-world-lesson-two
- Base / Head: c1b2b1c / fb30e5f
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors |
| static | `bun run lint` (inside `bun run verify`) | 0 | 66 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-DhfsC7ck.js` 232.00 kB / 72.73 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 17 files, 110 tests passed |
| all | `bun run verify` | 0 | the four stages above, in order |

Checks outside the unit layer, all run in this turn:

| Gate | Command | Result |
|---|---|---|
| FR-7 | `git status --porcelain` before committing | only `conductor/product.md`, `conductor/tech-stack.md`, `src/MAP.md` — **0 `.ts`/`.tsx` files**, so this phase adds no rendering at all. The FR-7 assertions from phases 3 and 4 are part of the 110 tests in the accepted run |
| NFR-1 | built asset names compared with phase 4 | JS is `index-DhfsC7ck.js`, the same hash phase 4 shipped, so no code and no CSS changed; 4 `prefers-reduced-motion` blocks still present |
| NFR-4 | `git diff 975daef -- package.json bun.lock \| wc -l` | 0 and 0 |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-8 | `bun run verify` exits 0 and the structure test passes with `src/world/` in `MAP.md` | the structure test is inside the 110 tests; `src/MAP.md:33` lists `src/world/` | pass |
| FR-8 | `MAP.md`, `tech-stack.md` and `product.md` describe the one world | see the three edits below | pass |

## Evidence

- `conductor/tech-stack.md` — `world/` added to the layout block, "The world" added to the seams
  table, `world/` added to the dependency direction, and **D-TS10** recorded.
- `conductor/product.md` — two decisions added under Open Questions and Assumptions: *One world*
  (all six lessons share the walker, arrows and path; lessons 1 and 2 shipped, with what each does)
  and *Concept wording* ("again and again", never "loop").
- `src/MAP.md` — the "add a game kind" recipe now says to render on the shared `src/world/Track.tsx`.

Everything written matches what the tests assert: lesson 1 is three arrow steps with the walker
moving one cell per correct tap (`SequenceGame.test.tsx`), lesson 2 is one tap and three steps
(`RepeatGame.test.tsx`), and both are spoken by the device voice (`LessonScreen*.test.tsx`).

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D1 | The docs describe the vocabulary as one walker plus three arrows, not the retired food pictures | spec D1 |
| D3 | `world/` is named as the seam in the layout, the seams table and the dependency direction | spec D3 |
| D10 | Product records that a stop's label comes from the curriculum data, which is why re-theming lesson 1 renamed its node too | spec D10 |

## Deviations

None. Three files changed, all three in `Touches`.

## Notes

The accepted run is the **first** run of this phase: `bun run verify` exited 0 immediately, with no
failed attempt to record. That is expected for a documentation-only phase and it is stated plainly
rather than dressed up.

One in-file correction while editing `tech-stack.md`: the layout block described `ui/` as "dumb
components: Button, Star", but that directory actually holds `pictures/` — one SVG per `PictureId`
plus its registry. Button and Star do not exist. The line now says what is there, since a stale map
line is exactly what a reader would trust next.
