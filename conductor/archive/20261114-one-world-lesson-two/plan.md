# One world, lesson two — Implementation Plan

> **Branch:** `feat/20261114-one-world-lesson-two`
> **Base:** `main` @ `c1b2b1c`
> **Autonomy:** ready
> **Decisions:** D1, D2, D3, D4, D5, D6, D7, D8, D9, D10
> **Effort:** 3

Every phase ends in `bun run verify` — typecheck → lint → build → test — which is the only
command that proves a phase in this project. No package is added by any phase; `Dependencies:
none` is meant literally.

Phase 1 is atomic on purpose: the picture registry is a `Record<PictureId, Component>`, so the
vocabulary change and lesson 1's rewrite cannot be separated without leaving the branch red.

## Phase 1: The world's pictures, and lesson 1 rebuilt in them

- **Goal:** lesson 1 plays as three arrow steps with one actor, and the food pictures are gone.
- **Depends on:** none
- **Covers:** FR-1, FR-2, FR-7, AC-1, AC-2, AC-7
- **Touches:** `src/ui/pictures/`, `src/content/lesson.ts`, `src/content/lessons/0001-order.ts`,
  `src/lesson/`
- **Dependencies:** none
- **Decisions:** D1, D2, D9
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 7149e4f
**Evidence:** conductor/archive/20261114-one-world-lesson-two/verification/phase-1.md

- [x] **P1.T1: the four sprites** — covers: FR-1
  - [x] **P1.T1.1:** `ui/pictures/Walker.tsx`, `StepUp.tsx`, `StepRight.tsx`, `StepDown.tsx` as
    inline SVG using `currentColor`, no emoji and no external asset
  - [x] **P1.T1.2:** the walker reads as an actor (rounded body, two feet) at 72 px, and each step
    reads as an arrow by silhouette, not by colour alone
- [x] **P1.T2: the vocabulary in the contract** — covers: FR-1
  - [x] **P1.T2.1:** `PictureId` becomes `'walker' | 'step-up' | 'step-right' | 'step-down'`;
    `Bread.tsx`, `Cheese.tsx`, `TopSlice.tsx` are deleted and the registry updated
- [x] **P1.T3: lesson 1 on the path** — covers: FR-2
  - [x] **P1.T3.1:** title "Walk the path"; cards `step-down, step-up, step-right`; solution
    `step-up, step-right, step-down` per D2
  - [x] **P1.T3.2:** concept line names the walker and the order in his words; the clip id stays
    `concept-order` so a later render does not orphan it
- [x] **P1.T4: nothing in a lesson is printed as an id** — covers: FR-7
  - [x] **P1.T4.1:** `ConceptScreen`'s finished-list label becomes world-neutral instead of
    "Your sandwich"
  - [x] **P1.T4.2:** the pending state in `LessonScreen.tsx` renders each card's picture instead of
    the raw id
- [x] **P1.T5: tests for the vocabulary** — covers: AC-1, AC-2, AC-7
  - [x] **P1.T5.1:** the registry test asserts one component per `PictureId`, and lesson 1's
    display order differs from its solution
  - [x] **P1.T5.2:** a rendered lesson subtree's text contains neither `step-` nor `walker`

## Phase 2: The track and the walker

- **Goal:** a shared track draws the cells and puts the walker in the cell the game says, and
  lesson 1 advances him one cell per correct tap.
- **Depends on:** Phase 1
- **Covers:** FR-3, AC-3, NFR-1
- **Touches:** `src/world/`, `src/games/sequence/`, `src/MAP.md`
- **Dependencies:** none
- **Decisions:** D3, D4
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 3aaa4f1
**Evidence:** conductor/archive/20261114-one-world-lesson-two/verification/phase-2.md

- [x] **P2.T1: the track** — covers: FR-3
  - [x] **P2.T1.1:** `world/Track.tsx` rendering `solution.length + 1` cells and the walker at a
    given index, with the placed steps visible in the cells behind him
  - [x] **P2.T1.2:** `world/walk.ts` holding the cell count and the per-cell timing constant, so
    both games share one answer
- [x] **P2.T2: the sequence game walks him** — covers: FR-3, D4
  - [x] **P2.T2.1:** a correct tap advances the walker one cell and keeps the placed card; a wrong
    tap leaves the index unchanged and still wobbles
  - [x] **P2.T2.2:** completion fires once, when the walker reaches the last cell
- [x] **P2.T3: the walk respects motion settings** — covers: NFR-1
  - [x] **P2.T3.1:** the forward move is a CSS transition; under
    `prefers-reduced-motion: reduce` the walker changes cell with a colour flash instead
- [x] **P2.T4: tests and the map** — covers: AC-3
  - [x] **P2.T4.1:** cell index 0→1→2→3 on the solution order; a wrong tap keeps it; one
    `onComplete` for the whole game
  - [x] **P2.T4.2:** `src/MAP.md` lists `src/world/` in `## Directories` (structure rule 6)

## Phase 3: The repeat game

- **Goal:** one arrow, one tap, three steps, one completion.
- **Depends on:** Phase 2
- **Covers:** FR-4, AC-4, NFR-1, NFR-4
- **Touches:** `src/games/repeat/`, `src/games/registry.ts`
- **Dependencies:** none
- **Decisions:** D3, D5
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 32c825f
**Evidence:** conductor/archive/20261114-one-world-lesson-two/verification/phase-3.md

- [x] **P3.T1: the game** — covers: FR-4
  - [x] **P3.T1.1:** `games/repeat/RepeatGame.tsx` with one tappable arrow and the track from
    Phase 2; a tap runs three steps of `STEP_MS` each, then calls `onComplete`
  - [x] **P3.T1.2:** taps during the walk and after it are ignored; timers are cleared on unmount
- [x] **P3.T2: its styles** — covers: NFR-1
  - [x] **P3.T2.1:** the arrow is at least 72 px from the `--tap-target` token, and the walk is
    replaced by a per-cell colour flash under `prefers-reduced-motion: reduce`
- [x] **P3.T3: register the kind** — covers: FR-4
  - [x] **P3.T3.1:** one entry in `games/registry.ts` mapping `repeat` to the component
    (structure rule 5 reads it)
- [x] **P3.T4: tests** — covers: AC-4, NFR-4
  - [x] **P3.T4.1:** fake timers: one tap → three steps → exactly one `onComplete`; a second tap
    adds nothing; no new dependency in `package.json`

## Phase 4: Lesson 2, its star and the unlock

- **Goal:** node 2 is playable, earns a star, unlocks node 3, and both survive a reload.
- **Depends on:** Phase 3
- **Covers:** FR-5, FR-6, AC-5, AC-6, NFR-5
- **Touches:** `src/content/lessons/`, `src/App.test.tsx`
- **Dependencies:** none
- **Decisions:** D6, D7, D8, D9
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 8b180f0
**Evidence:** conductor/archive/20261114-one-world-lesson-two/verification/phase-4.md

- [x] **P4.T1: the lesson data** — covers: FR-4, D6
  - [x] **P4.T1.1:** `content/lessons/0002-repeat.ts` — id `repeat`, title "Do it again", order 2,
    `gameKind: 'repeat'`, one card, concept clip id `concept-repeat`
  - [x] **P4.T1.2:** the concept line is the two sentences from D9, with no abstraction in it
- [x] **P4.T2: it joins the curriculum** — covers: FR-6
  - [x] **P4.T2.1:** added to `lessons` in `content/lessons/index.ts`; its `LessonCard` already
    exists at order 2 and is not duplicated
- [x] **P4.T3: the concept beat** — covers: FR-5, AC-5
  - [x] **P4.T3.1:** completing lesson 2 speaks `concept-repeat` once through the port and replay
    speaks it once more
- [x] **P4.T4: star and unlock across a remount** — covers: FR-6, AC-6, NFR-5
  - [x] **P4.T4.1:** play lesson 1 then lesson 2 → two stars, node 3 activatable, after a remount
  - [x] **P4.T4.2:** a narration port that throws still lets lesson 2 complete and award its star

## Phase 5: The docs catch up with the world

- **Goal:** the three documents the change invalidated describe the one world, and the
  structure test still passes.
- **Depends on:** Phase 4
- **Covers:** FR-8, AC-8
- **Touches:** `conductor/tech-stack.md`, `conductor/product.md`, `src/MAP.md`
- **Dependencies:** none
- **Decisions:** D1, D3, D10
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** fb30e5f
**Evidence:** conductor/archive/20261114-one-world-lesson-two/verification/phase-5.md

- [x] **P5.T1: the stack document** — covers: FR-8
  - [x] **P5.T1.1:** the layout block gains `src/world/`, and a recorded decision states the one
    world (actor + arrows + path) and why deviation needs a new decision
- [x] **P5.T2: the product document** — covers: FR-8
  - [x] **P5.T2.1:** the curriculum assumption names the re-themed lesson 1 and lesson 2 as
    shipped, and the six lessons' shared world
- [x] **P5.T3: the map's recipes** — covers: FR-8
  - [x] **P5.T3.1:** "add a game kind" mentions the track it reuses, so the next game starts from
    `src/world/` instead of inventing its own path
