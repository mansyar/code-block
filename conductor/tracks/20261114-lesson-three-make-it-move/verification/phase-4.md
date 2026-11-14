# Phase 4 — Lesson 3, its star, the unlock and the docs

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base / Head: ab08c1a / a1e2144
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors |
| static | `bun run lint` (inside `bun run verify`) | 0 | 84 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | 73.9 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 25 files, 173 tests passed (was 24 / 168) |
| all | `bun run verify` | 0 | the four stages above, in order |
| browser | Playwright against `https://pv-…style.dev/` (dev server on `0.0.0.0:3000`) | — | see **Browser check** |

## Item-by-item

| Plan item | Delivered | Where |
|---|---|---|
| P4.T1.1 | `0003-cause.ts`: id `cause`, order 3, "Make it move", `gameKind: 'plan'`, palette `['step-up','step-right']`, plan `['step-up','step-right','step-right','step-up']`, `flags: [2, 4]`, clip id `concept-cause` | `src/content/lessons/0003-cause.ts` |
| P4.T1.2 | The concept line is D8's sentence, with no abstraction in it: "You said go, and it went. Then you said go again — and it went again!" | same file |
| P4.T2.1 | Registered in `lessons`; the `LessonCard` for `cause` was already at order 3 and is untouched; six stops still | `src/content/lessons/index.ts` |
| P4.T3.1 | Completion at the last flag records the star, keeps the other two, unlocks node 4, survives a remount | `src/App.lessonThree.test.tsx` — "earns lesson 3 its own star and opens lesson 4", "keeps three stars across a remount", "stores the three completed lessons…" |
| P4.T3.2 | The last arrival is celebrated before the concept beat, which speaks `concept-cause` once and once more on replay; flag 1 gets the flag wave only | the same tests plus the existing `LessonScreen.celebrate` suite, which is unchanged |
| P4.T4.1 | Lesson 3's subtree text is its title and nothing else; GO is a button with an accessible name and no visible text | browser check below — visible text was exactly `←` and `Make it move` |
| P4.T4.2 | `src/MAP.md`, `tech-stack.md`, `product.md` describe plan-then-run in legs, the palette/plan split and the GO control | those three files |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-1 | `findLesson('cause')` returns the palette, the four-step plan and `flags: [2, 4]`; six stops with `cause` at order 3 | `src/content/lesson.test.ts` — "holds six stops…" and the contract suite run over every shipped lesson | pass |
| AC-9 | After lessons 1, 2 and 3 and a remount, three stars and node 4 activatable | `App.lessonThree.test.tsx` — the star, remount and storage tests | pass |
| AC-10 | The concept line once after the celebration and once more on replay; no `step-` or `walker` text; GO has a name and no visible text | "shows the plan it ran after the last flag, repeats and all" + browser check (text was `← Make it move`) | pass |
| FR-1 | Lesson 3 is content, not code | `0003-cause.ts` only; no branch in any component on the lesson id | pass |
| FR-9 | Completing the last leg earns the star, keeps the others, unlocks node 4, survives reload | the three `App.lessonThree` tests | pass |
| FR-10 | Arrival celebrated for `CELEBRATE_MS`, then the concept beat speaks once, replay once more | existing celebration suite (unchanged) driving lesson 1; lesson 3 uses the same screen path | pass |
| FR-11 | No lesson screen prints a sprite id or an instruction | browser check: the lesson screen's whole visible text was `←` and `Make it move` | pass |
| NFR-4 | No dependency added | `package.json` unchanged in the whole track | pass |
| NFR-5 | Completable with no voice; a throwing narration port does not block | unchanged narration port tests; lesson 3 speaks through the same `useLessonFlow` | pass |

## Browser check

Playwright, real Chromium, dev server bound to `0.0.0.0:3000` and served through the preview
hostname. Progress was seeded to `completed: ['order','repeat']` so lesson 3 was open, then the lesson
was played with real clicks and real timers:

| Step | Observed |
|---|---|
| open lesson 3 | 5 cells, 2 flags, walker on cell 0, visible text `←` + `Make it move` |
| tap up, tap right | both arrows appear on the road ahead of the walker, palette dims at two planned steps |
| press GO | walker moves to cell 2, stops on flag 1, plan cleared, palette live again, flag 2 still ahead |
| tap right, tap up, press GO | walker reaches cell 4, lesson reports completion, GO disabled, celebration runs |
| after `CELEBRATE_MS` | concept screen lists the plan `up, right, right, up` and the concept line |

Screenshots were taken at each step (`artifacts/02`–`06`, untracked); they are what found the finding
below, which no test in this repo can see.

## Finding (for review, not fixed here)

**The ribbon reads as dots, not as a road — on every lesson, not only this one.** Measured in the
browser: `.track` has `--gap: 0.75rem` (12 px) and `--road: 12px`, so each road segment is a 12 × 12
px square sitting in a 12 px gap between 126 px cells. What a child sees is five tiles joined by
small grey pips, which is not the "where the ribbon runs, he may go" reading FR-4 promises, and it is
the shape lesson 1 and lesson 2 already shipped with.

This phase does not change it: it is shared geometry, it needs a design decision (thinner road and a
wider gap, or a ribbon that runs under the cells), and no `D<n>` in this track authorises it. It is
recorded here so the review sees it rather than the screenshots staying in a folder.

## Deviations

- **`src/lesson/ConceptScreen.tsx` — one key, one helper.** The finished plan was keyed by card id,
  which is unique for lessons 1 and 2 but not for a plan that repeats an arrow: React warned "two
  children with the same key, `step-right`". Keying by the arrow's ordinal occurrence fixes it without
  an array index (biome rejects index keys). Outside the phase's `Touches`; required by lesson 3's
  content and disclosed.
- **`src/App.lessonThree.test.tsx` — my own assertion was wrong once.** The first version asserted the
  stored JSON did not contain `"cause"`, but the store writes `current: "cause"` for the next stop. It
  now parses the profile and asserts `completed`, which is stronger.

## Notes

`bun run verify` failed twice before passing: once on that over-strict assertion (test fixed, not
weakened), once on lint rejecting an index-based key (fixed by the ordinal key above). No test was
deleted, skipped or softened anywhere in the track.
