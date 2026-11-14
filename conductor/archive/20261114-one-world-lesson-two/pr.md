# One world, lesson two

## What

The curriculum now has a single visual world and its second playable lesson.

- **One world, and the arrows do not lie.** `PictureId` is one walker plus the three arrows it can
  obey, and each arrow means the direction it points: `up` moves him up, `right` right, `down` down,
  in every lesson. The road is drawn in full before the first tap — its route is the lesson's own
  solution read as directions — with a flag where it ends, so the *shape* of the road is the
  instruction. The road is drawn as a **ribbon** joining only consecutive cells, and the start and
  the goal are pads of their own — four equal tiles read as an open arena, and the flag sat one
  `right` away from the start, so the drawn line is what rules that move out. No sentence to read,
  none spoken: the child copies what he can see.
- **Lesson 1 rebuilt inside it.** Same id and file, new words: "Walk the path". Cards are shown
  `step-down, step-up, step-right` and solved `step-up, step-right, step-down`, so the display
  order is still never the solution order. The road goes up, then right, then down, and starts and
  ends on the same row — so a child who confuses up with down ends visibly in the wrong place. Each
  correct tap walks him one cell *in that arrow's direction*; a tap with no road that way wobbles
  and moves nothing.
- **Lesson 2 shipped, on the same grid.** "Do it again" is one arrow and one tap: its road runs
  three cells in that arrow's own direction, the walker walks all three, the three arrows stay on
  the road behind him, and the narrator says *"You said it
  once, and it hopped again and again. Three times!"* One instruction, three repeats — a loop
  shown as a picture, with the word left to the parent.
- **The arrival is celebrated.** Reaching the flag used to swap the screen on the same frame. The
  road now holds for 900 ms — the walker hops, the flag waves, sparks fly — and only then does the
  concept beat open. The star is still earned the instant he arrives, so leaving at that moment is
  never punished.
- **Progress unchanged.** `code-block.progress.v1` already held a list of completed lessons, so a
  second lesson is data, not a migration. Its star opens node 3 and both stars survive a reload.

## Why

The slice shipped one lesson with its own objects, which gave lessons 2–6 nothing to build on:
every new concept would have needed its own art and its own world. A single actor on a single path
makes the child's screen familiar, so the only new thing at each node is the concept itself — and
it makes each later lesson cost a mechanic instead of a sprite set. See
[spec.md](./conductor/archive/20261114-one-world-lesson-two/spec.md) and
[the plan](./conductor/archive/20261114-one-world-lesson-two/plan.md).

## Evidence

- Phase reports: [phase-1](./conductor/archive/20261114-one-world-lesson-two/verification/phase-1.md)
  · [phase-2](./conductor/archive/20261114-one-world-lesson-two/verification/phase-2.md)
  · [phase-3](./conductor/archive/20261114-one-world-lesson-two/verification/phase-3.md)
  · [phase-4](./conductor/archive/20261114-one-world-lesson-two/verification/phase-4.md)
  · [phase-5](./conductor/archive/20261114-one-world-lesson-two/verification/phase-5.md)
  · [phase-6](./conductor/archive/20261114-one-world-lesson-two/verification/phase-6.md)
  · [phase-7](./conductor/archive/20261114-one-world-lesson-two/verification/phase-7.md)
- Review: [review.md](./conductor/archive/20261114-one-world-lesson-two/review.md) — verdict **PASS**,
  pinned to `bb33099` (round 4, after the arrival celebration; rounds 1–3 kept in the file).
- Integrated verification: `bun run verify` exit 0 — typecheck, Biome (72 files), build, **127 tests
  in 20 files** (92 before this track). Build `234.87 kB / 73.73 kB gzip`, under the 200 kB budget.
- Visual: none. No browser is in the phase path; the reduced-motion behaviour was checked in the
  built stylesheet instead (`._walker_…{animation:none}` and `data-walker` colour flash are present).

## Coverage

| ID | Test | Evidence |
|---|---|---|
| FR-1 vocabulary | `src/ui/pictures/registry.test.tsx` | phase-1 |
| FR-2 lesson 1 re-themed | `src/lesson/LessonScreen.test.tsx` | phase-1 |
| FR-3 walker advances | `src/games/sequence/SequenceGame.test.tsx` | phase-2 |
| FR-4 one tap, three steps | `src/games/repeat/RepeatGame.test.tsx` | phase-3 |
| FR-5 concept line once | `src/lesson/LessonScreen.repeat.test.tsx` | phase-4 |
| FR-6 star and unlock | `src/App.lessonTwo.test.tsx` | phase-4 |
| FR-7 no printed ids | four assertions across `src/lesson/*.test.tsx` and `src/App.lessonTwo.test.tsx` | phases 1, 4 |
| FR-8 docs | structure rule 6 inside `bun run test` | phase-5 |
| NFR-1 motion | built stylesheet rule, quoted in phase-2 and phase-3 evidence | phases 2, 3 |
| NFR-4 no dependency | `git diff` on `package.json`/`bun.lock`: 0 lines | all phases |
| FR-9 an arrow is its direction | `src/world/path.test.ts`, `SequenceGame.test.tsx` | phase-6 |
| FR-10 the road is visible, with a goal | `SequenceGame.test.tsx` (coordinates, goal, arrival) | phase-6 |
| FR-11 lesson 2 on the same grid | `RepeatGame.test.tsx` (one row, `col` 0–3) | phase-6 |
| FR-12 the ribbon and the two pads | `src/world/Track.test.tsx` | phase-6 |
| FR-13 the arrival is celebrated | `src/lesson/LessonScreen.celebrate.test.tsx`, `src/world/Track.test.tsx` | phase-7 |
| AC-1…AC-13 | the rows above, one per criterion | all phases |

## Debt and follow-ups

Three Low findings from the review, none blocking, all recorded in
[review.md](./conductor/archive/20261114-one-world-lesson-two/review.md):

- **R1-1** — the concept screen draws `lesson.game.solution`, so lesson 2's payoff shows one arrow
  for a walk that took three. Fixing it honestly means the game reports what it did, which is a
  content-contract decision — a follow-up track, not a patch.
- **R1-2** — the 72 px minimum has no executable assertion; jsdom measures no stylesheet, so it is
  traced to `--tap-target`.
- **R1-3** — no `aria-live` completion announcement. Pre-existing.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D1 | One walker plus three arrows replace the food pictures; the type keeps the name `PictureId` | spec D1 |
| D2 | Lesson 1 re-themed in place — same id, same file, new words and steps | spec D2 |
| D3 | `src/world/` is the world's seam (not `shared/`, which rule 1 forbids) | spec D3 |
| D4 | One cell per correct tap; no separate "go" button | spec D4 |
| D5 | Three steps, defined in the repeat game; no new lesson-data field | spec D5 |
| D6 | Lesson 2 is one card with the same solution | spec D6 |
| D7 | Device voice, empty clip manifest, `concept-repeat` reserved | spec D7 |
| D8 | No progress schema change | spec D8 |
| D9 | "…hopped again and again. Three times!" — no abstractions in the spoken line | spec D9 |
| D10 | Node labels come from curriculum data | spec D10 |
| D11 | A grid, not a lane: `world/path.ts` owns `Cell {col,row}` and the three deltas | spec D11 |
| D12 | The route is derived from the lesson's solution, so road and answer cannot disagree | spec D12 |
| D13 | A wrong direction moves him nowhere — no dead end, no reset | spec D13 |
| D14 | The goal flag is scenery in `world/Goal.tsx`, never a `PictureId` | spec D14 |
| D15 | The road is a ribbon joining consecutive cells only; start and goal are their own pads | spec D15 |
| D16 | Celebrate in place for 900 ms; star at arrival, concept beat and speech after it | spec D16 |

## Notes

Structure rule 2 shaped two files: `src/App.lessonTwo.test.tsx` and
`src/lesson/LessonScreen.repeat.test.tsx` exist because adding those tests to `App.test.tsx` and
`LessonScreen.test.tsx` would have crossed the 200-line cap. Both are additive; no existing
assertion was edited or removed.

`git diff c1b2b1c..HEAD -- package.json bun.lock` is empty: this track adds no dependency.
