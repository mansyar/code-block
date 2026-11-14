# Review — Make it move

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base: `main @ ab08c1a`
- Round: 1
- Reviewed HEAD: `47a1615`
- Independence: cold-read (same host, fresh turn; inputs read from `spec.md`, `plan.md`, the diff and `verification/phase-*.md`)
- **Verdict: FIXABLE**

## Pass A — mechanical

| Check | Result | Note |
|---|---|---|
| Integrated verification on a clean run | pass | `bun run verify` exit 0 — typecheck, lint (84 files), build (74.92 kB gzip), 25 files / 173 tests. Log: `.conductor/evidence/verify-r1.log` |
| Evidence exists for every verified phase | pass | `verification/phase-1.md` … `phase-4.md`, one per phase, each with commands and an AC mapping |
| Plan and metadata agree | pass | plan 4/4 `Status: verified` with checkpoints; `metadata.json` 4 phases, 15 tasks, `last_checkpoint` = `a1e2144` |
| Decisions authorized | pass | every `## Decisions` row names a `D1`–`D10` present in `spec.md` |
| Scope | pass with a disclosed deviation | the union of `Touches` covers the diff except `src/lesson/ConceptScreen.tsx`, disclosed in `phase-4.md` |
| Tests weakened | pass | `git diff ab08c1a..HEAD -- '**/*.test.*'`: 655 lines added, 2 removed — both removed lines are import statements that were extended. No `skip`, `only`, `xit`, no deleted `it(`, no loosened assertion, test count 127 → 173 |
| Secrets | pass | no token, key or `.env` in the diff |
| Dependencies | pass | `package.json` and the lockfile are untouched across the whole track (NFR-4) |

## Pass B — coverage

Every requirement resolves to a changed file, a test, or a measured artifact. "Browser" means
measured in Chromium against the dev server, not inferred from CSS.

| ID | Resolves to | Status |
|---|---|---|
| FR-1 | `src/content/lessons/0003-cause.ts` (id `cause`, order 3, palette, plan, `flags: [2, 4]`) | met |
| FR-2 | `src/content/lesson.ts` — palette/plan split; `lesson.test.ts` "accepts a plan longer than the palette…" and the three rejections | met |
| FR-3 | `src/content/lesson.ts` `assertFlags`; `lesson.test.ts` five leg rejections + the no-flags case | met |
| FR-4 | `routeFor` + `Track` `goals`; `Track.test.tsx` five cells, flags on cells 2 and 4 | met |
| FR-5 | `PlanGame.add`/`removeAt`; "plans a leg of two steps and refuses to plan past the flag", "takes a planned step back…" | met |
| FR-6 | `world/run.ts` + `PlanGame.go`; engine suite and "walks the first leg on one press…", "ignores a second press…" | met |
| FR-7 | plan cleared, walker stays, palette returns — **but the flag does not wave and there is no beat** | **not met — R1-1** |
| FR-8 | `stepsThatFit` halts where the road stops; "halts where the road stops, keeping the plan…" and the leg-2 case | met |
| FR-9 | `App.lessonThree.test.tsx` — star, three stars across a remount, storage | met |
| FR-10 | `LessonScreen` celebration then concept; existing celebration suite (unchanged) + `App.lessonThree` "shows the plan it ran after the last flag…" | met |
| FR-11 | browser: lesson 3's whole visible text was `←` and `Make it move`; `PlanGame.test.tsx` "prints no words at all…" | met |
| NFR-1 | browser with `reducedMotion: reduce`: walker 0 → 1 → 2 on time, `animation-name: none`; tap feedback is state-driven | met |
| NFR-2 | browser: palette cards 90 × 90, GO 108 × 108, 16 px between cards, cells 123 px | met |
| NFR-3 | build 74.92 kB gzip against 200 kB; verify 24 s against 60 s | met |
| NFR-4 | no dependency, no lockfile change | met |
| NFR-5 | narration port tests unchanged; `useLessonFlow` swallows a throwing port | met |
| AC-1 … AC-10 | as recorded in `verification/phase-1..4.md`, re-derived here from the tests named there | met except AC-10's flag-wave clause, which belongs to R1-1 |

## Findings

| ID | Sev | Where | Impact | Fix | Blocks | Status |
|---|---|---|---|---|---|---|
| R1-1 | High | `src/games/plan/PlanGame.tsx` `onArrive`, `src/world/Track.tsx` | FR-7 says reaching an intermediate flag is "a beat" in which "the flag waves". Measured in Chromium across 720/760/820/900/1100 ms after the arrival, **neither flag animates at all** (`animation-name: none`) and the palette returns on the same frame. `verification/phase-4.md` claims "flag 1 gets the flag wave only", which is also untrue. | Mark the reached flag and hold a short beat (~400 ms) before clearing the plan and swapping legs; test it | yes | open |
| R1-2 | Medium | `src/world/Track.module.css` (`--gap`, `--road`) | The road between cells measures 12 × 12 px in a 12 px gap, so the path reads as pips rather than a ribbon, on lessons 1, 2 and 3. See **Deferred** — not fixed in this track. | needs a design decision | no | deferred |
| R1-3 | Low | `src/lesson/ConceptScreen.tsx` | Changed outside phase 4's `Touches`; disclosed, and required (a repeated-arrow plan produced duplicate React keys). Keying by ordinal occurrence is right; no action. | none | no | accepted |

## Deferred follow-up (not a fix this track authorises)

**R1-2 — the ribbon reads as dots.** Measured in the browser: `.track` computes `--gap: 0.75rem`
(12 px) and `--road: 12px`, with 126 px cells, so every road segment is a 12 × 12 px square sitting
in the gap. A child sees five tiles joined by small grey pips, not a continuous path, which weakens
the reading FR-4 relies on ("where the ribbon runs, he may go"). It is **pre-existing**: lesson 1
shipped with the same geometry, and the same numbers apply to lessons 1, 2 and 3.

The fix is one of at least three design choices — a thinner road with a wider gap, a ribbon that
underlaps the cells, or bigger cells with a smaller gap — each of which changes shared geometry for
already-shipped lessons and each of which needs a `D<n>` this track does not have. Recorded here
with the measurements and the cross-lesson blast radius rather than invented at review time.

## Deviations accepted

- `src/lesson/ConceptScreen.tsx` — one key helper, outside a phase's `Touches`, disclosed (R1-3).
- `GameKind` gained `'plan'` in phase 1 rather than phase 3, because the union lives in
  `src/content/lesson.ts`; disclosed in `phase-1.md`.
- `src/world/ribbon.ts` — extraction forced by structure rule 2 at 206 lines; code moved verbatim.

## Notes

The track's strongest evidence is not the unit suite: it is the browser run in `phase-4.md`, which is
what found R1-2. Its weakest is phase 4's claim about the flag wave, which is what R1-1 corrects —
the lesson there is that an FR written as a visual beat needs a DOM measurement, not a code read.
