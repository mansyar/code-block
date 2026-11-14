# Review — 20261114-one-world-lesson-two

- Round: 4
- Base / Head: c1b2b1c / bb33099
- Reviewed SHA: bb33099b32a1efbd51e862eef94eae38be9700f6
- Rounds 1–3: PASS at `44c4e18`, `bcd3c3f`, `2873962` — kept below, unchanged
- Independence: cold-read for rounds 1–2; round 3 reviews a mechanic the same agent implemented in
  the same session, and says so rather than claiming independence it does not have
- Verdict: PASS

## Mechanical

| Check | Result |
|---|---|
| Commands pass on a clean run | pass — round 4, re-run on `bb33099`: `bun run verify` exit 0, typecheck, Biome (72 files), build `dist/assets/index-xBJvcLtD.js` `234.87 kB / 73.73 kB` gzip, **127 tests in 20 files**. Log: `.conductor/evidence/20261114-one-world-lesson-two/celebrate2.log` |
| Evidence exists | pass — `verification/phase-1.md` … `phase-5.md` present for all five verified phases |
| State honest | pass — plan `Result: verified` ×5, checkpoints `7149e4f, 3aaa4f1, 32c825f, 8b180f0, fb30e5f`; `metadata.json` reports 5/5 phases, 20/20 tasks, `last_checkpoint: fb30e5f` |
| Decisions authorized | pass — every `## Decisions` row in the evidence files names a `D<n>` that exists in `spec.md` (D1–D10 all present) |
| Scope | pass — every path in `git diff --name-only c1b2b1c..HEAD` is inside a phase's `Touches` or is a disclosed deviation: `src/content/lessons/index.ts` (phase 1), `src/content/lesson.ts` (phase 3, one-line `GameKind` widening), `src/App.lessonTwo.test.tsx` and `src/lesson/LessonScreen.repeat.test.tsx` (phase 4, both new and additive) |
| Tests weakened | pass — 0 `skip`/`only`/`todo` added, 0 `it(` removed, count 92 → 110. Four `expect(` lines were removed, each replaced by something stricter: `/bread/i` → the lesson's actual first card; `plate()` length 3 → exact walker cell **plus** exact steps on the path; length 0 → cell 0 plus an empty step list; length 1 → cell 1 |
| No secrets | pass — no key-shaped literals, no staged `.env*` |
| Dependencies | pass — `package.json` and `bun.lock` both 0 diff lines; NFR-4 held by every phase |

## Coverage

| ID | Implemented | Test | Evidence | Status |
|---|---|---|---|---|
| FR-1 | `src/content/lesson.ts` (`PictureId` = walker + 3 steps), `src/ui/pictures/registry.ts` | `registry.test.tsx` (one component per id) | phase-1 | pass |
| FR-2 | `src/content/lessons/0001-order.ts`, `src/content/lessons/index.ts` | `LessonScreen.test.tsx` "shows the cards in their display order, which is not the solution" | phase-1 | pass |
| FR-3 | `src/world/Track.tsx`, `src/games/sequence/SequenceGame.tsx` | `SequenceGame.test.tsx` — per-tap cell index, wrong tap, placed card | phase-2 | pass |
| FR-4 | `src/games/repeat/RepeatGame.tsx` | `RepeatGame.test.tsx` — one tap, three steps, one completion, repeat ignored | phase-3 | pass |
| FR-5 | `src/content/lessons/0002-repeat.ts` | `LessonScreen.repeat.test.tsx` — spoken once, replay once | phase-4 | pass |
| FR-6 | `src/content/lessons/index.ts`, existing store | `App.lessonTwo.test.tsx` — star, node 3, remount, `['order','repeat']` | phase-4 | pass |
| FR-7 | `LessonScreen.tsx` pending state, `ConceptScreen.tsx` label | `LessonScreen.test.tsx` ×2, `LessonScreen.repeat.test.tsx`, `App.lessonTwo.test.tsx` (map text) | phases 1, 4 | pass |
| FR-8 | `conductor/tech-stack.md`, `conductor/product.md`, `src/MAP.md` | structure rule 6 inside `bun run test` | phase-5 | pass |
| NFR-1 | `Track.module.css`, `RepeatGame.module.css` | built-stylesheet check in phase 2 and 3 evidence | phases 2, 3 | pass |
| NFR-2 | `--tap-target` in `src/styles/tokens.css`, used by both games | no executable assertion — jsdom cannot measure px. Traced as evidence; see R1-2 | phase-1/2 evidence | pass (evidence) |
| NFR-3 | build `72.73 kB` gzip, verify ≈15 s | the run above | this file | pass |
| NFR-4 | — | `git diff` on `package.json`/`bun.lock`: 0 lines | phases 1–5 | pass |
| NFR-5 | `useLessonFlow`, on-screen concept line | `LessonScreen.repeat.test.tsx` completes and leaves without a voice; phase-1 broken-port test | phase-4 | pass |
| AC-1 | vocabulary + exhaustive registry | `registry.test.tsx`; a retired id no longer type-checks | phase-1 | pass |
| AC-2 | three arrow cards, display order ≠ solution | `LessonScreen.test.tsx`; 72 px traced to `--tap-target` | phase-1 | pass |
| AC-3 | walker 0→1→2→3, wrong tap no move, one completion | `SequenceGame.test.tsx` | phase-2 | pass |
| AC-4 | one card, three steps, one `onComplete`, second tap inert | `RepeatGame.test.tsx` (incl. a same-tick double tap, probed below) | phase-3 | pass |
| AC-5 | concept line once, replay once more | `LessonScreen.repeat.test.tsx` | phase-4 | pass |
| AC-6 | two stars, node 3 activatable, survives remount | `App.lessonTwo.test.tsx` | phase-4 | pass |
| AC-7 | no sprite id or instruction as text, per lesson and on the map | `LessonScreen.test.tsx` ×2, `LessonScreen.repeat.test.tsx`, `App.lessonTwo.test.tsx` | phases 1, 4 | pass |
| AC-8 | `bun run verify` exit 0 with `src/world/` in `MAP.md` | structure test inside the 110 | phase-5 | pass |

## Findings

| ID | Sev | Where | Impact | Fix | Blocks | Status |
|---|---|---|---|---|---|---|
| R1-1 | Low | `src/lesson/ConceptScreen.tsx:17` | The payoff strip renders `lesson.game.solution`. For lesson 2 that is one arrow, so the screen after the walk shows less repetition than the walk did. No AC is affected — FR-5 only requires the beat and the line | let the game report the steps it actually took, so the strip can show three | no | open (debt) |
| R1-2 | Low | `src/ui/pictures`, `src/games/*/**.module.css` | NFR-2's 72 px minimum has no executable assertion: jsdom applies no stylesheet, so size is only traceable to `--tap-target` in tokens plus `min-width: calc(var(--tap-target) * 1.25)` | a build-output assertion, or a real browser check in the review layer the project does not have | no | open (debt) |
| R1-3 | Low | `src/lesson/ConceptScreen.tsx` | `react.md` asks for an `aria-live` announcement of completion. None exists, so a screen reader hears the line only through narration. Pre-existing — this track changed one label here, not the beat | wrap the concept line in `aria-live="polite"` | no | open (debt) |

No Critical, High or Medium finding. Nothing was fixed inline: this review changed no application code, tests or history.

## Debt

- R1-1, R1-2, R1-3 — Low, recorded above. R1-1 is the one worth a follow-up decision, because the honest fix needs the game to report what it did, which is a contract change rather than a patch.

## Notes

Two edges were checked rather than assumed:

1. **A double tap on the repeat arrow.** `react.md` requires a play call to be safe twice. A throwaway probe (two `fireEvent.click` in the same tick, then all timers advanced) showed exactly one completion, the walker on cell 3 and three steps on the path. The probe was deleted; the tree was clean before and after.
2. **The "Coming soon" branch in `App.tsx`** prints a sentence for a lesson id with no content. It is unreachable in this track — nodes 3–6 are locked — and this track did not change it. Noted so the next track that unlocks node 3 remembers node 3 has no lesson yet.

`metadata.json` carries `review_verdict: pass`, `review_rounds: 4` and this SHA.

## Round 2 — re-pin after the pre-merge archive

**Why this round exists.** Round 1 pinned `44c4e18`. After it, the parent asked for the track to be
archived *before* the merge, so the branch head moved to `bcd3c3f`. A verdict pinned to a commit that
is no longer the head is not a verdict about what the PR would merge, so the review was re-run rather
than carried over on assertion alone.

**What actually changed between the two pins.** `git diff --name-status 44c4e18..bcd3c3f` is 13 paths,
and every one is under `conductor/`:

| Change | Paths |
|---|---|
| Renamed, unchanged content (R100) | `spec.md`, `mission.md`, and `verification/phase-1.md` … `phase-5.md` — files moved from `tracks/` to `archive/` |
| Renamed, content edited (R055, R094) | `index.md` (status, phase table, Delivery section), `plan.md` (links rewritten to the archive path) |
| Rewritten | `metadata.json` (`status: complete`, `archived_at`, `archive_path`; `pr_state` still `open`), `pr.md` (links), plus `conductor/index.md` and `conductor/tracks.md` outside the track |
| **Application code** | **none — `src/` differs in 0 files; `package.json` and `bun.lock` differ in 0 files** |

**Verification re-run, not assumed.** `bun run verify` exited 0 on `bcd3c3f` at review time: 67 files
linted, 110 tests in 17 files, worktree clean. The build produced `index-DhfsC7ck.js` at
`232.00 kB / 72.73 kB` gzip — the identical asset hash R1 recorded, which is stronger evidence than
"the diff is empty" that the shipped bundle is the reviewed one.

**Verdict.** Unchanged: **PASS**. All eight FR, five NFR and eight AC rows above were re-traced against
the same code and still hold; the coverage table was not rewritten because nothing it cites changed.

**Findings.** No new finding. R1-1, R1-2 and R1-3 remain open Low debt, recorded as they were — this
round did not touch `src/`, so there was nothing for a Review Fixes phase to act on and none was
opened. Nothing was weakened or deleted to reach this verdict.

**Pin.** `Reviewed SHA: bcd3c3fc17159dc5a1de685734a9f553c4e303f3`. The commit that then carried this file (`d7bea90`) was state
only — review, metadata and the archive bookkeeping — and `git diff bcd3c3f..d7bea90 -- src` is empty. That claim is scoped to
round 2: round 3 deliberately changed `src/` for the grid world, which is why it re-pins in the section below.

## Round 3 — the grid world (Phase 6)

**Why this round exists.** After round 2 the parent played lesson 1 and rejected the mechanic, not
the implementation: the arrows were ordinals on a straight lane, so nothing on screen said which
arrow came next and nothing said where the walker was going. The world was changed so that a step
*is* its direction and the road is visible. That is new behaviour with new code, so it gets a review
of its own rather than an amended verdict.

**What changed.** `src/world/path.ts` (new) owns the grid — `Cell {col,row}`, the three deltas,
`tracePath`, `routeFor(lesson)`, `repeatRoute`. `src/world/Goal.tsx` (new) marks the last cell.
`Track.tsx` and its stylesheet were rewritten to lay the route out on a CSS grid, and then again to draw the road as a ribbon with distinct start and goal pads (`FR-12`). Both games now
draw `routeFor(lesson)` / `repeatRoute(card, 3)`. `walk.ts` lost `cellsFor`, whose only consumer was
the sequence game. Spec gained FR-9–11, AC-9–11 and D11–D14; `MAP.md`, `tech-stack.md` and
`product.md` describe the grid.

**Verification, re-run at `2873962`.** `bun run verify` exit 0: 71 files linted, 123 tests in 19
files, build `234.21 kB / 73.51 kB` gzip — 73.51 kB against a 200 kB budget.

**Requirements traced.** FR-9 (an arrow is its direction) and FR-10 (the road is visible and has a
goal) are asserted on the DOM in `SequenceGame.test.tsx`: the four cells carry `data-col`/`data-row`
`(0,0) (0,-1) (1,-1) (1,0)`, exactly one is `data-goal="true"`, and the walker's coordinates follow
his index along that route. FR-11 is asserted in `RepeatGame.test.tsx`: `row` 0 and `col` 0–3, one
goal, three cells from one tap. FR-7 still holds — the road is drawn, never described; the repeat
game's subtree is asserted to have empty `textContent` before, during and after the walk.

**Tests were not weakened.** The suite went 110 → 123. One assertion was *replaced*, not deleted:
`expect(cellsFor(lessonOne)).toBe(solution.length + 1)` became
`expect(routeFor(lessonOne)).toHaveLength(solution.length + 1)` plus the explicit coordinate list,
which is strictly stronger. No `skip`, `only` or `todo` was added. `Track.test.tsx` is new and additive.

**Findings.** No new finding. R1-1, R1-2 and R1-3 remain open Low debt, unchanged — Phase 6 did not
touch the concept screen or the tap-target rule. The nearest thing to a new observation is
cosmetic: the goal flag sits at the corner of its cell so that it is still visible when the walker
stands on it, which means the flag is slightly outside the cell's box. Not recorded as debt.

**Not checked.** No browser was used, so the grid's *appearance* — spacing, whether the zigzag reads
clearly at 72 px, whether the flag is legible under the walker — is unverified by this review. The
DOM structure and the stylesheet's rules are what was reviewed. This is the same limitation R1-2
records.

**Pin (moved once inside this round).** `Reviewed SHA: 2873962c08d055866ea258b2c3d9142c2831e069`.

### Round 3, second pass — the ribbon

The pin moved from `f6fd6fa` to `2873962` inside this round rather than opening a round 4, because the
round had not been reported or shipped when the change landed. What changed: `Track` now draws one
ribbon per *consecutive* pair of route cells and nothing else, and marks the first and last cells as
`data-start` / `data-goal` pads with their own styling; cells are sized from the road's width so the
widest lesson does not overflow. `src/world/Track.test.tsx` (4 tests) asserts the ribbon count and
orientations, one start pad, one goal pad, the pads being distinct elements, and the one-row grid of a
straight road.

Why it matters for the verdict rather than being cosmetic: the review of `f6fd6fa` traced FR-9 to a
grid, but the rendered grid put the flag one step from the start with no line saying otherwise, so the
world still *implied* a move the game refuses. FR-12 records the rule that closes that gap, and AC-12
asserts it. Verdict unchanged: **PASS**.
