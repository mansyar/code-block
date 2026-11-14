# One world, lesson two

## What

The curriculum now has a single visual world and its second playable lesson.

- **One world.** `PictureId` is one walker plus the three arrows it can obey. The walker, the
  arrows and the path replace the bread, cheese and top slice, and the same three sprites will
  serve lessons 3–6.
- **Lesson 1 rebuilt inside it.** Same id and file, new words: "Walk the path". Cards are shown
  `step-down, step-up, step-right` and solved `step-up, step-right, step-down`, so the display
  order is still never the solution order. Every correct tap walks the walker one cell forward;
  a wrong tap still wobbles and moves nothing.
- **Lesson 2 shipped.** "Do it again" is one arrow and one tap: the walker takes that same step
  three times, the three arrows stay on the path behind him, and the narrator says *"You said it
  once, and it hopped again and again. Three times!"* One instruction, three repeats — a loop
  shown as a picture, with the word left to the parent.
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
- Review: [review.md](./conductor/archive/20261114-one-world-lesson-two/review.md) — verdict **PASS**,
  independence cold-read, pinned to `bcd3c3f` (round 2 re-pin after the pre-merge archive).
- Integrated verification: `bun run verify` exit 0 — typecheck, Biome, build, **110 tests in 17
  files** (92 before this track). Build `232.00 kB / 72.73 kB gzip`.
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
| AC-1…AC-8 | the eight rows above, one per criterion | all phases |

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

## Notes

Structure rule 2 shaped two files: `src/App.lessonTwo.test.tsx` and
`src/lesson/LessonScreen.repeat.test.tsx` exist because adding those tests to `App.test.tsx` and
`LessonScreen.test.tsx` would have crossed the 200-line cap. Both are additive; no existing
assertion was edited or removed.

`git diff c1b2b1c..HEAD -- package.json bun.lock` is empty: this track adds no dependency.
