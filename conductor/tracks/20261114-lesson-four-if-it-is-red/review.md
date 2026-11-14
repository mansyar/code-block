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
