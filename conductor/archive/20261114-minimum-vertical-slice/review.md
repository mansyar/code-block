# Review — 20261114-minimum-vertical-slice

- Round: 2
- Base / Head: ebfafe3 / 0f1526f
- Reviewed SHA: 0f1526f
- Independence: cold-read
- Verdict: PASS

Round 1 was `FIXABLE` with two blocking findings; Phase 7 fixed both and added a regression test
for each. Re-derived from `spec.md`, `plan.md`, the diff and the evidence — not from the round-1
notes.

## Mechanical

| Check | Result | Note |
|---|---|---|
| Commands on a clean run | pass | `bun run verify` exit 0 at 0f1526f — 14 files, 92 tests, 72.24 kB gzip, 10 precache entries (`.conductor/evidence/review-r2-verify.log`) |
| Evidence for every verified phase | pass | `verification/phase-1.md` … `phase-7.md` |
| State honest | pass | 7/7 phases verified, 38 tasks done, `last_checkpoint` a62d605 is an ancestor of HEAD |
| Decisions authorized | pass | every evidence `## Decisions` row names a `D<n>` from `spec.md`; phase 7 takes none |
| Scope against Touches | pass | phase 7 touched 5 files, all inside its `Touches`; earlier deviations stay disclosed |
| Tests weakened | pass | 92 tests (from 90); 0 removed, no `skip`/`only`/`todo`; phase 7 only made assertions stronger |
| No secrets | pass | no credential, key or `.env*` in the diff |
| Dependencies | pass | no dependency change in phase 7 |

## Coverage

| ID | Implemented | Test | Evidence | Status |
|---|---|---|---|---|
| FR-1 | `src/App.tsx` | `App.test.tsx` opens on the map | phase-2.md | pass |
| FR-2 | `src/journey/JourneyMap.tsx` | `JourneyMap.test.tsx` locked/open, marker shape | phase-2.md | pass |
| FR-3 | `src/App.tsx`, `src/content/lessons/0001-order.ts` | `App.test.tsx` display order | phase-3.md | pass |
| FR-4 | `src/games/sequence/SequenceGame.tsx` | `SequenceGame.test.tsx` (6) | phase-3.md | pass |
| FR-5 | `src/lesson/useLessonFlow.ts`, `ConceptScreen.tsx` | `LessonScreen.test.tsx` concept + replay | phase-4.md | pass |
| FR-6 | `src/progress/store.ts`, `src/lesson/LessonScreen.tsx:finishGame` | `LessonScreen.test.tsx` "reports the lesson complete as soon as the game is finished"; `store.test.ts` | phase-7.md | pass |
| FR-7 | `src/App.tsx`, `src/journey/JourneyMap.tsx` | `App.test.tsx` "keeps the star when the child leaves by the back control instead of done" | phase-7.md | pass |
| FR-8 | `vite.config.ts`, `public/icons/` | `src/pwa.test.ts` (8) | phase-6.md | pass |
| FR-9 | `src/progress/schema.ts`, `local-storage.ts` | `local-storage.test.ts`, `App.test.tsx` fresh-profile tests | phase-5.md | pass |
| NFR-1 | no network call in `src/` | — (grep only) | phase-5.md | pass, debt R1-3 |
| NFR-2 | `tokens.css`, `base.css`, `JourneyMap.module.css:43` | cards are `<button>`s; locked number 7.35:1 | phase-3.md, phase-7.md | pass |
| NFR-3 | `useLessonFlow.ts` | "still shows the concept when the voice fails" | phase-4.md | pass |
| NFR-4 | — | verify run recorded in `.conductor/evidence/` | all | pass |
| NFR-5 | build output | `pwa.test.ts` payload bound; 72.24 kB gzip / 237 KiB precache | phase-6.md | pass |
| NFR-6 | responsive CSS only | — | — | unverified here, debt R1-4 |
| NFR-7 | `tokens.css`, `SequenceGame.module.css` | built CSS carries the media query | phase-3.md | pass |
| AC-1 … AC-5 | as FR-1 … FR-5 | as above | phase-2/3/4.md | pass |
| AC-6 | `store.ts`, `App.tsx` | "keeps the star and the open stop across a remount" | phase-5.md | pass |
| AC-7 | `LessonScreen.finishGame`, `App.tsx` | back-control test + remount test | phase-7.md | pass |
| AC-8 | `dist/` | `src/pwa.test.ts` | phase-6.md | pass |
| AC-9 | `schema.ts` | `local-storage.test.ts`, `App.test.tsx` | phase-5.md | pass |

## Findings

| ID | Sev | Where | Impact | Fix | Blocks | Status |
|---|---|---|---|---|---|---|
| R1-1 | High | `src/lesson/LessonScreen.tsx:52` | Star recorded only from the concept beat's "done", so leaving by the back control lost it (FR-6, AC-7) | record at game completion; "done" only leaves | yes | fixed |
| R1-2 | Medium | `src/journey/JourneyMap.module.css:43` | Locked node number 3.58:1, under NFR-2's 4.5:1 | `--colour-ink`, 7.35:1 | yes | fixed |

No regressions: the 90 tests that passed in round 1 still pass, and the two added ones assert the
behaviour the findings asked for.

## Debt

- R1-3 (Low) — NFR-1's "no tap path performs a network request" rests on a grep and the phase-5
  evidence, not on a check in the suite. A structure rule over `src/` would make it repeatable.
- R1-4 (Low) — NFR-6 (iPad Safari 16+, both orientations) cannot be observed in this environment;
  the tablet steps in `verification/phase-6.md` cover it for a human.
- `--colour-ink-muted` is now unused as node text. It is still a token, not dead code in the
  stylesheet sense; recorded so the next track knows why it exists.

## Summary

Every FR, NFR and AC now traces to code and a test or a named evidence artifact, except the two
low-severity items above, which are recorded as debt and do not block. The track is green at
`0f1526f` and ready to ship.
