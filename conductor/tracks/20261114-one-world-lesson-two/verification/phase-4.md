# Phase 4 — Lesson 2, its star and the unlock

- Track: 20261114-one-world-lesson-two
- Branch: feat/20261114-one-world-lesson-two
- Base / Head: c1b2b1c / 8b180f0
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
| FR-7 (lesson 2) | assertion in `LessonScreen.repeat.test.tsx` — "prints the title and the concept line, and no sprite id anywhere" | after removing the title and the concept line, the only text left is the back arrow `←`; also asserts no `/step-\|walker/` before and after the walk |
| FR-7 (locked stops) | assertion in `App.lessonTwo.test.tsx` — "shows a locked stop as a lock shape, never as a printed instruction" | the map's whole `textContent` equals `Your path` + `123456`; 5 lock markers and 5 `data-state="locked"` nodes |
| NFR-1 | `grep '@media (prefers-reduced-motion:reduce)' dist/assets/*.css` | 4 blocks, same as phase 3 — this phase adds no motion at all: the star is a static SVG marker and the unlock is a state change |
| NFR-4 | `git diff 4392513 -- package.json bun.lock \| wc -l` | 0 and 0 |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-5 | Lesson 2's concept line reaches the narration port exactly once, replay once more | `LessonScreen.repeat.test.tsx` "speaks its concept line exactly once when the walk finishes, and again on replay" | pass |
| AC-6 | After completing lesson 2 and remounting: two stars, node 3 activatable | `App.lessonTwo.test.tsx` "earns lesson 2 its own star and opens lesson 3", "keeps both stars and the open stop across a remount" | pass |
| FR-6 | Both ids stored under the unchanged key, version 1 | "stores both completed lessons under the unchanged key" → `{version: 1, completed: ['order','repeat']}` | pass |
| NFR-5 | Still completable with the voice off | the concept beat is reached and `done` leaves the screen in the same test; phase 1's broken-port test still passes | pass |

## Evidence

- `git diff 4392513..HEAD` — `src/content/lessons/0002-repeat.ts` (new),
  `src/content/lessons/index.ts` (registered), `src/App.lessonTwo.test.tsx` (new),
  `src/lesson/LessonScreen.repeat.test.tsx` (new).
- Lesson 2's data is the D6 shape: `gameKind: 'repeat'`, `cards: ['step-right']`,
  `solution: ['step-right']`.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D6 | Lesson 2 is `gameKind: 'repeat'` with one card and the same solution — a single-instruction lesson in data | spec D6 |
| D7 | Narration stays the device voice with an empty clip manifest; no Chatterbox render | spec D7 |
| D8 | No progress schema change: `code-block.progress.v1` already holds a list of completed ids | spec D8 |
| D9 | Concept line: "You said it once, and it hopped again and again. Three times!" — no abstractions | spec D9 |

## Deviations

- `src/App.test.tsx` — **planned, then not needed.** The plan put the app-level lesson-2 tests
  there, but that file reached 220 lines and tripped structure rule 2 (the 200-line cap). It was
  restored to its committed state and the new tests live in `src/App.lessonTwo.test.tsx` instead.
  Nothing in `App.test.tsx` changed.
- `src/App.lessonTwo.test.tsx` — new file outside `Touches`. Same four tests, same assertions.
- `src/lesson/LessonScreen.repeat.test.tsx` — new file outside `Touches`, anticipated in the brief:
  AC-5 needs the narration port, and `LessonScreen.test.tsx` is not in this phase's `Touches`.
  It is purely additive; no existing assertion was edited.

## Notes

Three `bun run verify` runs, all recorded:

1. **Exit 1 — lint.** Biome wanted the map-text assertion's template literal on its own lines.
   Fixed.
2. **Exit 1 — two test failures**, both real:
   - `structure rule 2`: `src/App.test.tsx` was 220 lines because of the added tests. Fixed by
     moving them to a new file rather than deleting anything.
   - `LessonScreen.repeat.test.tsx`: my exact-equality text assertion assumed the back arrow was
     not part of `textContent`. The assertion was not weakened — it now subtracts the title and the
     concept line and requires the remainder to be exactly `←`, which is stricter than the
     contains-style check it replaced.
3. **Exit 0 — 110 tests, 17 files.** The accepted run.

Locked/unlocked messaging is state and shape only: `data-state`, `disabled`, and a lock `svg`.
No sentence about locking exists anywhere in the app.
