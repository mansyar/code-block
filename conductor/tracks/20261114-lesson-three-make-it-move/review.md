# Review — Make it move

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base: `main @ ab08c1a`
- Round: 2
- Reviewed SHA: `e93afd8` (the accepted state, five phases and five evidence files)
- Rounds: 1 FIXABLE at `47a1615` — kept below, unchanged
- Independence: cold-read for both rounds (same host, fresh turn; inputs are `spec.md`, `plan.md`, the
  diff and `verification/phase-*.md`, not the memory of writing the code)
- **Verdict: PASS**

The pin is the state reviewed. The review's own commit touches only `conductor/` and
`metadata.json`, so `git diff e93afd8..HEAD -- src/` is empty and the shipped tree is exactly the
reviewed one.

## Round 2 — mechanical

| Check | Result | Note |
|---|---|---|
| Verification on a clean run | pass | `bun run verify` exit 0 — typecheck, Biome (84 files, no warnings), build `dist/assets/index-DFuk6gAe.js` 238.76 kB / **74.97 kB gzip**, **174 tests in 25 files**. Log: `.conductor/evidence/verify-phase5.log` |
| Evidence for every verified phase | pass | `verification/phase-1.md` … `phase-5.md`; phase 5 covers R1-1 |
| Plan and metadata agree | pass | plan 5/5 `Status: verified`, checkpoints `566821e, c84a19d, eef4d84, a1e2144, 43a4614`; metadata 5/5 phases, 16/16 tasks, `last_checkpoint: 43a4614` |
| Decisions authorized | pass | every `## Decisions` row names a `D1`–`D10` in `spec.md`; phase 5 took none, which is correct — it implements FR-7 as written |
| Scope | pass | the only path outside a phase's `Touches` in the whole track is `src/lesson/ConceptScreen.tsx`, disclosed and necessary (R1-3) |
| Tests weakened | pass | 173 → 174 tests. One existing test was **strengthened**: "walks the first leg on one press…" used to assert the plan was gone on the arrival frame; it now asserts the plan is held during the beat and gone after it |
| Secrets | pass | none in the diff |
| Dependencies | pass | `package.json` and the lockfile untouched across the track (NFR-4) |

## Round 2 — findings carried forward

| ID | Sev | Status | Note |
|---|---|---|---|
| R1-1 | High | **fixed** | `FLAG_BEAT_MS` (400 ms) in `walk.ts`; `Track` waves only the flag named by `wave`; `PlanGame` holds the plan and keeps the palette inert through the beat, then clears the plan and opens leg 2. Proven in Chromium at 740 ms: cell 2 `data-wave="true"` with `animation-name: _wave_…`, cell 4 `none`, walker still on 2, plan `step-up, step-right` still on the road, palette disabled; at 1190 ms: no wave, plan cleared, palette enabled, walker still on 2 |
| R1-2 | Medium | **deferred, unchanged** | The ribbon reads as dots — see below. Not fixed here, by instruction and by judgement |
| R1-3 | Low | accepted | `ConceptScreen.tsx` key helper, disclosed in `phase-4.md` |

## Round 2 — coverage

Every FR, NFR and AC now resolves to a changed file, a test or a measured artifact.

| ID | Resolves to | Status |
|---|---|---|
| FR-1 | `0003-cause.ts` — id `cause`, order 3, palette, four-step plan, `flags: [2, 4]` | met |
| FR-2 | `content/lesson.ts` palette/plan split; `lesson.test.ts` | met |
| FR-3 | `assertFlags` + five leg rejections | met |
| FR-4 | `routeFor` + `Track` `goals`; five cells, flags on 2 and 4 | met |
| FR-5 | `PlanGame.add` / `removeAt`; three tests | met |
| FR-6 | `world/run.ts` + `PlanGame.go`; engine suite, GO tests | met |
| FR-7 | flag waves, plan held, palette waits, walker stays | **met — R1-1 fixed and proven in the browser** |
| FR-8 | `stepsThatFit` halts where the road stops; two tests | met |
| FR-9 | `App.lessonThree.test.tsx` — star, remount, storage | met |
| FR-10 | `LessonScreen` celebration → concept; celebration suite + lesson-3 test | met |
| FR-11 | browser: visible text was `←` and `Make it move`; "prints no words at all" | met |
| NFR-1 | browser, `reducedMotion: reduce`: walker 0 → 1 → 2 on time, `animation-name: none` | met |
| NFR-2 | browser: cards 90 × 90, GO 108 × 108, 16 px gaps, cells 123 px | met |
| NFR-3 | 74.97 kB gzip against 200 kB; verify 24 s against 60 s | met |
| NFR-4 | no dependency added anywhere | met |
| NFR-5 | narration port tests unchanged; concept text on screen | met |
| AC-1 … AC-10 | re-derived from the tests named in `verification/phase-1..5.md` | met |

## The one thing PASS does not mean

**R1-2 is deferred, and it is a real defect.** The road between cells measures 12 × 12 px inside a
12 px gap (measured: `--gap: 0.75rem`, `--road: 12px`, 126 px cells), so the "ribbon" FR-4 relies on
renders as pips between tiles. It is **pre-existing** — lesson 1 shipped with it — and it affects
lessons 1, 2 and 3 identically.

It is deferred because every fix (a thinner road with a wider gap, a ribbon that underlaps the cells,
or larger cells and a smaller gap) changes shared geometry for lessons already shipped, and this
track's decisions `D1`–`D10` do not authorise any of them. PASS therefore means *this track does what
it says*, not *the road looks right*. That sentence is the honest reading of this verdict, and the
next track should start with that decision.

## Round 1 (kept, unchanged) — FIXABLE at `47a1615`

Round 1 raised one blocking finding, R1-1: FR-7 says reaching an intermediate flag is "a beat" in
which "the flag waves", but sampling the DOM at 720/760/820/900/1100 ms after the arrival showed
`animation-name: none` on **both** flags, with the palette returning and the plan clearing on the
arrival frame. That round also recorded that `verification/phase-4.md` claimed "flag 1 gets the flag
wave only", which was untrue at the time.

R1-2 (the ribbon) was raised in round 1 as a Medium and deferred with its measurements and its
cross-lesson blast radius; R1-3 (`ConceptScreen.tsx` outside `Touches`) was recorded as accepted
because the change was disclosed, necessary and correct.

The lesson round 1 taught, worth keeping: a requirement written as a *visual beat* needs a DOM
measurement, not a code read. Phase 4's evidence passed on a claim; the browser is what caught it.
