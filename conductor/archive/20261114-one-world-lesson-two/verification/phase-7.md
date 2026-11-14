# Phase 7 — evidence

**Goal:** reaching the end is seen to happen. The screen holds on the arrival while the road
celebrates it, and only then opens the concept beat.

**Status:** verified
**Covers:** FR-13, AC-13, NFR-1, NFR-5
**Decisions:** D16

## The problem

`SequenceGame` and `RepeatGame` both called `onComplete` on the arrival frame, and `LessonScreen`
switched to `ConceptScreen` in the same commit — so the walker never stood at the flag. The child
worked out a road, walked it, and the reward was that the road vanished.

The parent's report: "when the character reaches the destination the screen would automatically go
to the next one. I think it should celebrate the arrival on destination first, then go to next
screen."

## What the phase changed

| File | Change |
|---|---|
| `src/world/walk.ts` | `CELEBRATE_MS = 900`, beside `STEP_MS` — one place owns the beat's length |
| `src/world/Track.tsx` | `celebrating` prop; `data-celebrate` on the road; six sparks at the goal (`data-sparks`) |
| `src/world/Track.module.css` | `hop` on the walker, `wave` on the flag, `spark` burst; all three replaced by a static arrangement under `prefers-reduced-motion` |
| `src/games/registry.ts` | `GameProps.celebrating?: boolean` — the shell tells the game it is holding |
| `src/games/sequence/SequenceGame.tsx`, `src/games/repeat/RepeatGame.tsx` | forward `celebrating` to `Track`; neither changes when it reports completion |
| `src/lesson/LessonScreen.tsx` | holds the screen for `CELEBRATE_MS`, then `complete()`; star reported at arrival |
| `src/lesson/LessonScreen.celebrate.test.tsx` | new — 3 tests |
| `src/world/Track.test.tsx` | +1 test |
| `src/App.test.tsx`, `src/App.lessonTwo.test.tsx`, `src/lesson/LessonScreen.test.tsx`, `src/lesson/LessonScreen.repeat.test.tsx` | the celebration is its own tick, so the flows advance `CELEBRATE_MS` before expecting the concept beat |

## The timing decision

**The star is earned at arrival, not after the celebration.** `finishGame` still calls `onComplete`
immediately, so leaving by the back control during the hop keeps the star — the child did finish. Only
`flow.complete()` — which opens the concept beat and speaks the line — waits for `CELEBRATE_MS`.

That also keeps the voice honest: the line arrives with the concept screen instead of talking over the
celebration.

## Tasks

- [x] **P7.T1: the beat** — covers: FR-13, D16
  - [x] **P7.T1.1:** `CELEBRATE_MS` in `world/walk.ts`; `LessonScreen` holds, then calls `complete()`
  - [x] **P7.T1.2:** the star is reported at arrival; a timer cleared on unmount means leaving during
    the celebration earns it and skips the concept
- [x] **P7.T2: the celebration itself** — covers: FR-13, NFR-1
  - [x] **P7.T2.1:** walker hop, flag wave, six sparks at the goal, driven by `data-celebrate`
  - [x] **P7.T2.2:** reduced motion removes the travel and keeps a static arrangement of sparks
- [x] **P7.T3: tests** — covers: AC-13, NFR-5
  - [x] **P7.T3.1:** arrival: `onComplete` once, `data-celebrate` present, no concept text; after the
    beat the concept text is there
  - [x] **P7.T3.2:** no narration until the decoration is over; leaving mid-celebration calls
    `onComplete` once and `onClose` once

## Verification

Command: `bun run verify` (typecheck → lint → build → test)

| Stage | Result |
|---|---|
| typecheck | clean |
| Biome | 72 files, no fixes applied |
| build | `dist/assets/index-xBJvcLtD.js` — 234.87 kB / **73.73 kB gzip** (NFR-3 budget 200 kB) |
| tests | **127 passed, 20 files** (123 before this phase; +4 here) |

`FR-7` still holds: the celebration is shapes and colour. Nothing in it is a word, and the sequence
game's subtree still contains neither `step-` nor `walker`.

## Deviations

- **`LessonScreen.test.tsx` lost a test it briefly held.** The celebration test was written there
  first and pushed that file to 216 lines, which structure rule 2 refuses; it moved to
  `LessonScreen.celebrate.test.tsx` with three tests instead of one. Nothing was deleted from the
  suite — 123 → 127.
