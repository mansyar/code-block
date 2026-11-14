# Review — 20261114-minimum-vertical-slice

- Round: 1
- Base / Head: ebfafe3 / ed79f78
- Reviewed SHA: ed79f78
- Independence: cold-read
- Verdict: FIXABLE

Re-derived from `spec.md`, `plan.md`, the diff and the evidence files, then checked against the
built output. Two findings block: one on the star's recording path, one on text contrast.

## Mechanical

| Check | Result | Note |
|---|---|---|
| Commands on a clean run | pass | `bun run verify` exit 0 — 14 files, 90 tests, build 72.24 kB gzip, 10 precache entries (`.conductor/evidence/review-r1-verify.log`) |
| Evidence for every verified phase | pass | `verification/phase-1.md` … `phase-6.md` all present |
| State honest | pass | plan `Status`/`Checkpoint`/`Evidence` and `metadata.json` agree at 6/6 phases, 36 tasks |
| Decisions authorized | pass | every `## Decisions` row names a `D<n>` in `spec.md`: D1, D2, D3, D4, D7, D8 |
| Scope against Touches | pass | all changes inside a phase's `Touches` union except four disclosed deviations (`src/content/lessons/0001-order.ts`, `src/MAP.md`, `src/structure.test.ts`, `src/App.test.tsx`, plus `bun.lock`), each recorded in its phase evidence |
| Tests weakened | pass | 78 test assertions added, 0 removed, no `skip`/`only`/`todo`; 90 tests now |
| No secrets | pass | no credential, key or `.env*` in the diff |
| Dependencies | pass | `bun.lock` + `package.json` match phase 6's declared `vite-plugin-pwa` |

## Coverage

| ID | Implemented | Test | Evidence | Status |
|---|---|---|---|---|
| FR-1 | `src/App.tsx:60` | `src/App.test.tsx` "opens on the journey map…" | phase-2.md | pass |
| FR-2 | `src/journey/JourneyMap.tsx:33` | `JourneyMap.test.tsx` locked/open + marker shape | phase-2.md | pass |
| FR-3 | `src/App.tsx:48`, `src/content/lessons/0001-order.ts` | `App.test.tsx` "opens lesson 1 … display order" | phase-3.md | pass |
| FR-4 | `src/games/sequence/SequenceGame.tsx` | `SequenceGame.test.tsx` (6 tests: order, wrong tap, placed, twice) | phase-3.md | pass |
| FR-5 | `src/lesson/useLessonFlow.ts:22`, `ConceptScreen.tsx` | `LessonScreen.test.tsx` concept + replay | phase-4.md | pass |
| FR-6 | `src/progress/store.ts:29`, `src/App.tsx:28` | `store.test.ts`, `local-storage.test.ts`, `App.test.tsx` | phase-5.md | **fail — R1-1** |
| FR-7 | `src/journey/JourneyMap.tsx:33` | `JourneyMap.test.tsx` star + next open; `App.test.tsx` | phase-5.md | **fail — R1-1** |
| FR-8 | `vite.config.ts:12`, `public/icons/` | `src/pwa.test.ts` (8 tests) | phase-6.md | pass |
| FR-9 | `src/progress/schema.ts:35`, `local-storage.ts:22` | `local-storage.test.ts`, `App.test.tsx` fresh-profile tests | phase-5.md | pass |
| NFR-1 | no network call in `src/` | — (grep only, no guard) | phase-5.md | pass, debt R1-3 |
| NFR-2 | `src/styles/tokens.css:41`, `base.css:41` | `SequenceGame.test.tsx` cards are buttons; built CSS | phase-3.md | **fail — R1-2** |
| NFR-3 | `useLessonFlow.ts:30` | `LessonScreen.test.tsx` "still shows the concept when the voice fails" | phase-4.md | pass |
| NFR-4 | — | `bun run verify` completes well inside 60 s | all | pass |
| NFR-5 | build output | `src/pwa.test.ts` payload bound; build reports 72.24 kB gzip / 237 KiB | phase-6.md | pass |
| NFR-6 | responsive CSS only | — | — | unverified here, debt R1-4 |
| NFR-7 | `tokens.css:61`, `SequenceGame.module.css:73` | built CSS contains the media query | phase-3.md | pass |
| AC-1 … AC-5 | as FR-1…FR-5 | as above | phase-2/3/4.md | pass |
| AC-6 | `store.ts`, `App.tsx` | `App.test.tsx` "keeps the star … across a remount" | phase-5.md | pass |
| AC-7 | `App.tsx:28`, `JourneyMap.tsx` | `App.test.tsx`, `JourneyMap.test.tsx` | phase-5.md | **fail — R1-1** |
| AC-8 | `dist/` | `src/pwa.test.ts` | phase-6.md | pass |
| AC-9 | `schema.ts:35` | `local-storage.test.ts`, `App.test.tsx` | phase-5.md | pass |

## Findings

| ID | Sev | Where | Impact | Fix | Blocks | Status |
|---|---|---|---|---|---|---|
| R1-1 | High | `src/lesson/LessonScreen.tsx:47` | The star is recorded only from the concept beat's "done". The header back control is on screen during the beat (`LessonScreen.tsx:33` → `onClose`), so a child who finishes the game and taps back returns to a map with **no star and node 2 still locked**, contradicting FR-6 ("completion records exactly one star") and AC-7. The store is already idempotent, so recording at completion is safe | record the lesson when the **game** reports completion (`LessonScreen.tsx:51`), and make "done" leave the screen instead of doing the recording; `App.tsx:28` then records without closing | yes | open |
| R1-2 | Medium | `src/journey/JourneyMap.module.css:42` | Locked node number is `--colour-ink-muted` on `--colour-lock` = **3.58:1**, below NFR-2's 4.5:1 for text. The other three node states are 9.85:1, 12.09:1 and 15.16:1 | use `var(--colour-ink)` there — 7.35:1 on the same background | yes | open |

## Debt

- R1-3 (Low) — NFR-1's "no tap path performs a network request" is supported by a one-off grep and
  the phase-5 evidence, not by a check in the suite. A structure rule over `src/` would make it
  repeatable. Recorded, not blocking.
- R1-4 (Low) — NFR-6 (iPad Safari 16+, both orientations) cannot be observed here. The tablet
  steps in `verification/phase-6.md` cover it for a human. Recorded, not blocking.

## Summary

The slice is real: the map, the order game, the concept beat and its narration, persisted progress
and an installable offline build are all implemented and tested, with 90 tests and no weakened
assertions. Two things must change before shipping — the star has to be earned when the game is
finished rather than when a button is pressed, and the locked node's number needs ink instead of
muted ink to clear the contrast floor.
