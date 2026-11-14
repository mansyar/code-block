# Review — 20261114-one-world-lesson-two

- Round: 1
- Base / Head: c1b2b1c / 44c4e18
- Reviewed SHA: 44c4e1812a45b4a739b4c41f09f35c4a5be8522b
- Independence: cold-read
- Verdict: PASS

## Mechanical

| Check | Result |
|---|---|
| Commands pass on a clean run | pass — `bun run verify` exit 0 on `44c4e18`: typecheck, Biome (66 files), build `232.00 kB / 72.73 kB` gzip, **110 tests in 17 files**. Log: `.conductor/evidence/20261114-one-world-lesson-two/review-r1-verify.log`. Worktree clean afterwards |
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

`metadata.json` carries `review_verdict: pass`, `review_rounds: 1` and this SHA. The commit that follows this file is state only (this review plus those three fields), so `git diff 44c4e18..HEAD -- src` is empty when ship runs.
