# Review — If it is red

- Track: 20261114-lesson-four-if-it-is-red
- Branch: feat/20261114-lesson-four-if-it-is-red
- Base: `main @ d8654a8`
- Round: 1
- Reviewed SHA: `a2a5d22` (the accepted state: three phases, three evidence files)
- Independence: cold-read — same host, fresh turn; every claim re-derived from `spec.md`, `plan.md`,
  the diff `d8654a8..a2a5d22` and `verification/phase-1..3.md`, then re-measured in the running app
- **Verdict: PASS**

The review's own commit touches only `conductor/` and `metadata.json`, so `git diff a2a5d22..HEAD --
src/` is empty and the shipped tree is exactly the reviewed one.

## Mechanical

| Check | Result | Note |
|---|---|---|
| Verification on a clean run | pass | `bun run verify` exit 0 — typecheck, Biome (93 files), build 241.95 kB / **75.75 kB gzip**, **207 tests in 30 files** |
| Evidence for every verified phase | pass | `verification/phase-1.md`, `phase-2.md`, `phase-3.md`; plan shows 3/3 `Status: verified` |
| Plan and metadata agree | pass | plan 3/3 phases, 14/14 tasks, checkpoints `7708862, 9df492b, a2a5d22`; metadata 3/3, 14/14, `last_checkpoint: a2a5d22` |
| Decisions authorized | pass | every `## Decisions taken` row names a `D1`–`D8` defined in `spec.md`; phases 1–3 declare `D2, D3`, `D1, D4, D5`, `D6, D7, D8` |
| Scope | pass | two disclosed deviations, both in phase evidence: `src/world/road-run.test.ts` (new file, split to respect the 200-line cap) and `src/world/path.test.ts` (one assertion made specific to non-repeating lessons) |
| Tests weakened | pass | 182 → 207 tests; no `skip`/`only`/`todo` added, no assertion deleted; the one changed assertion still checks every non-repeating lesson and asserts its set is non-empty |
| Secrets | pass | none in the diff |
| Dependencies | pass | `package.json` and `bun.lock` untouched (NFR-1) |
| Structure rules (200 lines, no barrels, ids, registry) | pass | `Track.tsx` 180, `run.ts` 180, `ConditionGame.tsx` 148, `spans.ts` 94, `App.lessonFour.test.tsx` 186; no new barrel; id `condition` matches `0004-condition.ts`; kind resolves |

## Coverage

| ID | Resolves to | Status |
|---|---|---|
| FR-1 | `0004-condition.ts` — id `condition`, order 4, two arrows, four steps | met |
| FR-2 | `GameSpec.twice` + `assertTwice`; absent ⇒ unchanged routes | met |
| FR-3 | `routeFor` → `withRepeats`; `path.test.ts` lengths and directions | met |
| FR-4 | five rejection cases, each naming the lesson | met |
| FR-5 | `Track` `pads` + `data-pad="red"` + diamond in `Track.module.css` | met — measured in the browser |
| FR-6 | `reachOf` + `runRoad`; two cells and two beats on the pad | met — measured |
| FR-7 | append, tap-to-remove with everything after it, cap at the plan's length | met |
| FR-8 | `completeLesson('condition')`; star kept, node 5 opened, same key | met |
| FR-9 | screen text is `←If it is red` in jsdom **and** in the browser | met |
| FR-10 | celebration before the concept; line names "red" and "again" | met |
| FR-11 | lessons 1–3 keep `plan.length + 1` cells and no pads | met |
| NFR-1 | no dependency anywhere | met |
| NFR-2 | cells 89 px in a browser, floor 72; the pad is not a control | met |
| NFR-3 | 75.75 kB gzip against 200 kB | met |
| NFR-4 | reduced motion: pad `animation-name: none`, walk still 0 → 5 in ~1.7 s | met — re-measured |
| NFR-5 | structure rules inside `bun run verify` | met |
| AC-1 … AC-10 | as mapped in `plan.md`; each names a test or a measured artifact | met |

## Findings

| ID | Sev | Where | Note | Status |
|---|---|---|---|---|
| R1-1 | Low | `ConditionGame.tsx` / `PlanGame.tsx` palette | A tap on an arrow once the plan is full changes nothing. The card is dimmed (`data-full="true"`) so the state is visible, but the tap itself gets no acknowledgement — the guidelines ask every tap to respond within 100 ms. **Pre-existing**: lesson 3 shipped the same behaviour, and changing it here would change a shipped game inside a track that did not authorise it. Recorded as debt for a shared palette-control fix. | accepted |

No Critical, High or Medium finding is open.

## Re-measured at this SHA (not copied from the phase records)

Lesson 4 in Chromium against the dev server: six cells, one pad at cell 3 with
`transform: matrix(0.707107, …)` (a 45° diamond) and `pointer-events: none`, cells **89 px**, text
`←If it is red`, every road band `aria-hidden`, palette `[step-up, step-right]`. Walk sampled at
~350 ms per cell: `0 → 1 → 2 → 3 → 4 → 5`, with the pad's arrow taking two beats and the rest one.
With `prefers-reduced-motion: reduce`: pad animation `none`, and the same walk on the same cadence.
A fifth tap on the full plan leaves four arrows planned.

## What this review did not establish

- Nothing was played to the end of the curriculum, so lessons 5 and 6 were not re-checked.
- No physical tablet, zoom level or system text-scaling check.
- The pad's legibility was judged from computed styles and screenshots, not from a colour-blindness
  simulation; the diamond is what carries the rule, which is why R1-1's area (feedback) and not the
  pad's hue was the only finding.
- `runRoad`'s timing was measured in jsdom with fake timers and in Chromium by sampling; neither is
  frame-accurate.

## Verdict

**PASS.** No Critical or High open; every FR, NFR and AC resolves to a changed file, a test or a
measured artifact; R1-1 is Low, pre-existing and recorded rather than silently fixed. Next:
`conductor-implement ship`.

---

# Round 2 — after the R1-1 fix

- Round: 2
- Reviewed SHA: `05ab65e` (the phase-4 acceptance; the code it carries is `f93d35d`)
- Delta under review: `a2a5d22..f93d35d` — `src/games/` and `conductor/product-guidelines.md`
- Independence: cold-read of the delta against R1-1 and `verification/phase-4.md`, then re-measured
  in the running app
- **Verdict: PASS**

## Mechanical

| Check | Result | Note |
|---|---|---|
| Verification on a clean run | pass | `bun run verify` exit 0 — Biome **94 files**, build 242.36 kB / **75.89 kB gzip**, **209 tests in 30 files** (was 207) |
| Evidence for the new phase | pass | `verification/phase-4.md`; plan shows 4/4 `Status: verified` |
| Plan and metadata agree | pass | 4/4 phases, 16/16 tasks, `last_checkpoint: f93d35d` |
| Scope | pass | every touched file is named in phase 4's `Touches`; no deviation |
| Tests weakened | pass | 207 → 209; no assertion removed, skipped or loosened; the existing cap test still asserts the cap |
| Dependencies | pass | `package.json` and `bun.lock` untouched |
| Structure rules | pass | `palette.ts` 38, `PlanGame.tsx` 180, `ConditionGame.tsx` 158, `PlanGame.test.tsx` 194 — all under 200, no barrel, no new kind or id |

## Findings

| ID | Sev | Where | Note | Status |
|---|---|---|---|---|
| R1-1 | Low | `PlanGame.tsx`, `ConditionGame.tsx` palette | **Closed.** A tap the plan cannot take marks that one card `data-refused="true"` for 400 ms, outlined `solid 3px rgb(226, 102, 138)` at a 4 px offset; the sibling card stays `outline: none` and the plan is unchanged before, during and after the flash. One shared hook means the two games cannot drift. The cue is static, so reduced motion needs no exception, and no words are added (FR-9 holds). | closed |

No new Critical, High, Medium or Low finding.

## Re-measured at this SHA

Both games, in Chromium against the dev server: lesson 3 with two arrows planned, lesson 4 with
four. In each, one tap more produces `data-refused="true"` on the pressed arrow only, the computed
outline above, and no change in the number of planned arrows (2 and 4 respectively); after 500 ms the
outline is gone. GO still runs lesson 4's road to cell 5 and reports completion once. No console or
page errors.

## What round 2 did not establish

- The full curriculum was not replayed this round; the delta touches the plan and condition games
  only, and lessons 1–2 and 5–6 use other kinds.
- No physical tablet, zoom or text-scaling check; the cue is a 3 px outline at a 4 px offset, which
  was judged from its computed style and a screenshot, not from a low-vision simulation.

## Verdict

**PASS**, pinned to `05ab65e`. R1-1 is closed with code, tests and a browser measurement; nothing was
weakened to close it, and no acceptance criterion changed.
