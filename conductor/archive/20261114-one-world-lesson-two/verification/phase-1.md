# Phase 1 — The world's pictures, and lesson 1 rebuilt in them

- Track: 20261114-one-world-lesson-two
- Branch: feat/20261114-one-world-lesson-two
- Base / Head: c1b2b1c / 7149e4f
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors across 4 sprites, the contract and lesson 1 |
| static | `bun run lint` (inside `bun run verify`) | 0 | 58 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-Czy8WfHb.js` 230.54 kB / 72.26 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 14 files, 95 tests passed |
| all | `bun run verify` | 0 | the four stages above, in order |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-1 | The registry resolves all four ids, and a retired id fails typecheck | `src/ui/pictures/registry.test.tsx:7` (ids list) + `registry.ts` is `Record<PictureId, …>`, so `'bread'` no longer type-checks | pass |
| AC-2 | Lesson 1 shows three arrow cards in an order that is not its solution | `src/lesson/LessonScreen.test.tsx` "shows the cards in their display order, which is not the solution"; tokens give 72 px via `--tap-target` on `.card` | pass |
| AC-7 | A lesson's rendered text contains no sprite id | `src/lesson/LessonScreen.test.tsx` "draws pictures, never sprite ids, as text" and "…whose game is not built yet, and says nothing" | pass |
| FR-1 | One actor and three arrow steps are the vocabulary | `src/content/lesson.ts:5`, `src/ui/pictures/registry.ts` | pass |
| FR-2 | Lesson 1 re-themed in the world's words | `src/content/lessons/0001-order.ts` — "Walk the path", up/across/down | pass |
| FR-7 | No lesson prints an id or an instruction | `src/lesson/LessonScreen.tsx` pending state draws sprites; the "still being built" note is gone | pass |

## Evidence

- `git diff d8d76b9..7149e4f` — 18 files, 190 insertions, 117 deletions; three food pictures deleted, five sprite files added.
- Build output line above is from the accepting run; no screenshot: this phase changes art, not layout, and no browser is in the phase path.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D1 | One actor + three arrows replace bread/cheese/top; the type keeps the name `PictureId` | spec D1 |
| D2 | Lesson 1 keeps id `order` and file `0001-order.ts`; title "Walk the path"; cards `step-down, step-up, step-right`; solution `step-up, step-right, step-down` | spec D2 |

## Deviations

- `src/content/lessons/index.ts` — the curriculum card still read "Make a sandwich", so the map
  label disagreed with the lesson header. D10 says node labels come from that data, so the one
  line was updated. Outside `Touches`.
- `src/App.test.tsx` — two lines. One selector matched `/bread/i`, a sprite that no longer exists;
  it now derives the card name from the lesson. The second assertion had to become precise because
  `/step/i` matches all three cards. Outside `Touches`; no assertion was weakened, both are
  stricter than before.

## Notes

`bun run verify` exited 1 twice before passing, for two **different** causes, both recorded rather
than retried blindly:

1. Lint: import order in `LessonScreen.tsx` and one over-long SVG element in `Walker.tsx`.
   Fixed by matching the project's own formatting.
2. Tests: the stale curriculum title above (2 failures in `App.test.tsx`). Fixed by the deviation
   listed here.

The third run is the first run of the second cause's repair, and it is the one accepted. Nothing
was loosened: the suite grew from 92 to 95 tests, and the two edited `App.test.tsx` assertions are
stricter than the ones they replaced.
