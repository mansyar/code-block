# Make it move — Implementation Plan

> **Branch:** `feat/20261114-lesson-three-make-it-move`
> **Base:** `main` @ `ab08c1a`
> **Autonomy:** ready
> **Decisions:** D1, D2, D3, D4, D5, D6, D7, D8, D9, D10
> **Effort:** 3

Every phase ends in `bun run verify` — typecheck → lint → build → test — which is the only command
that proves a phase in this project. No package is added by any phase; `Dependencies: none` is meant
literally.

The mechanic is one idea in four layers: the contract learns that a plan may be longer than the
palette and that a road may be walked in legs (phase 1), the road learns to draw more than one flag
(phase 2), the engine and the game turn a leg at a time into movement (phase 3), and the curriculum,
its star and the docs adopt it (phase 4).

## Phase 1: The contract learns palette, plan and legs

- **Goal:** a lesson can name two arrows, plan four steps, and say where its legs end — and a
  malformed lesson still fails at import time.
- **Depends on:** none
- **Covers:** FR-2, FR-3, AC-2, AC-3
- **Touches:** `src/content/lesson.ts`, `src/content/lesson.test.ts` (new),
  `src/content/lessons/0001-order.ts`, `src/content/lessons/0002-repeat.ts`
- **Dependencies:** none
- **Decisions:** D2, D3, D4
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 566821ed7b03785ac48fa1ac9dde7e3b8eb7fc70
**Evidence:** conductor/tracks/20261114-lesson-three-make-it-move/verification/phase-1.md

- [x] **P1.T1: palette vs plan** — covers: FR-2
  - [x] **P1.T1.1:** `GameSpec.solution` documents itself as the whole road and may be longer than
    `cards`; `cards` documents itself as the palette
  - [x] **P1.T1.2:** `assertLesson` keeps rejecting a duplicate card, an empty plan and a plan step
    outside the palette, and stops requiring the plan to match the palette's length
- [x] **P1.T2: legs** — covers: FR-3
  - [x] **P1.T2.1:** `GameSpec.flags?: readonly number[]` — optional plan positions where a leg ends;
    absent means one leg ending at the end of the plan
  - [x] **P1.T2.2:** `assertLesson` rejects an empty list, a repeated or descending position, a
    position past the end, and a last position that is not the end of the plan
- [x] **P1.T3: the existing lessons still say what they mean** — covers: FR-2, FR-3
  - [x] **P1.T3.1:** lessons 1 and 2 are unchanged in behaviour and declare no `flags`; their
    comments name palette and plan where they used to say "solution"
- [x] **P1.T4: tests for the new rules** — covers: AC-2, AC-3
  - [x] **P1.T4.1:** a four-step plan over a two-card palette is accepted; duplicate card, empty
    plan and unknown step each throw with the lesson's id
  - [x] **P1.T4.2:** `[2, 4]` is accepted for a four-step plan; `[]`, `[2, 2]`, `[4, 2]`, `[2, 5]`
    and `[2]` each throw; a lesson with no `flags` is accepted, and every shipped lesson passes
    `assertLesson` through the curriculum list

## Phase 2: The road can show more than one flag

- **Goal:** `Track` draws a flag at every leg boundary, and a one-leg lesson looks exactly as it does
  today.
- **Depends on:** Phase 1
- **Covers:** FR-4, AC-4
- **Touches:** `src/world/Track.tsx`, `src/world/Track.module.css`, `src/world/Track.test.tsx`
- **Dependencies:** none
- **Decisions:** D3
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P2.T1: the flags prop** — covers: FR-4
  - [ ] **P2.T1.1:** `Track` takes `goals?: readonly number[]` (default: the last cell) and marks each
    as `data-goal="true"`; the goal pad styling stays as it is, so two flags read as two places
  - [ ] **P2.T1.2:** the celebration spark burst stays anchored to the **last** flag, not to the first
- [ ] **P2.T2: tests** — covers: AC-4
  - [ ] **P2.T2.1:** five cells for lesson 3's road with exactly two `data-goal` cells at index 2 and
    4; a lesson without goals still renders exactly one, at the end

## Phase 3: The engine and the game, a leg at a time

- **Goal:** a plan drawn on the road runs to the next flag with one press of GO, the walker stays
  where he stopped, and the next leg is planned from there.
- **Depends on:** Phase 2
- **Covers:** FR-5, FR-6, FR-7, FR-8, AC-5, AC-6, AC-7, AC-8, NFR-1
- **Touches:** `src/world/`, `src/games/plan/`, `src/games/registry.ts`
- **Dependencies:** none
- **Decisions:** D1, D4, D5, D6, D7
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P3.T1: the engine** — covers: FR-6, FR-8, D1
  - [ ] **P3.T1.1:** `world/run.ts` — `runPlan(route, plan, { from, to, onStep, onStuck, onArrive })`
    walks while the plan's next step is the road's next cell, stops at `to`, at the end of the plan,
    or where the road does not continue
  - [ ] **P3.T1.2:** the engine returns a cancel function that clears its timers, and never calls
    `onArrive` twice
- [ ] **P3.T2: the game** — covers: FR-5, FR-7, D6, D7
  - [ ] **P3.T2.1:** `games/plan/PlanGame.tsx` renders the road with its flags, the palette, the GO
    pad, and the current leg's plan on the road ahead of the walker
  - [ ] **P3.T2.2:** appending and removing are capped at the current leg's length; the walker's index
    survives a leg change and the plan does not
- [ ] **P3.T3: running a leg** — covers: FR-6, FR-7, FR-8
  - [ ] **P3.T3.1:** GO runs the leg, is disabled while running, ignores a second press, and reports
    completion only from the last leg
  - [ ] **P3.T3.2:** an intermediate arrival waves the flag, clears the plan, keeps the walker and
    leaves him editable; a wrong plan halts where the road stops and reports nothing; unmounting
    mid-run cancels the timers
  - [ ] **P3.T3.3:** leg 2 is planned and run from the cell the walker stands on, so a test that
    reuses leg 1's plan (`up, right`) halts at once instead of finishing — the legs are read from
    the road, not replayed from the first plan
- [ ] **P3.T4: register the kind** — covers: FR-6
  - [ ] **P3.T4.1:** one entry in `games/registry.ts` mapping `plan` to the component; `GameKind`
    gains `'plan'` (structure rule 5 reads the registry)
- [ ] **P3.T5: styles and motion** — covers: NFR-1
  - [ ] **P3.T5.1:** GO and the palette use `--tap-target`; both runs respect
    `prefers-reduced-motion: reduce` with a per-cell colour flash

## Phase 4: Lesson 3, its star, the unlock and the docs

- **Goal:** node 3 is playable as two legs, earns a star at the last flag, unlocks node 4, and the
  three documents describe the mechanic.
- **Depends on:** Phase 3
- **Covers:** FR-1, FR-9, FR-10, FR-11, AC-1, AC-9, AC-10, NFR-4, NFR-5
- **Touches:** `src/content/lessons/`, `src/App*.test.tsx`, `src/MAP.md`,
  `conductor/tech-stack.md`, `conductor/product.md`
- **Dependencies:** none
- **Decisions:** D3, D8, D9, D10
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P4.T1: the lesson data** — covers: FR-1, D3, D8
  - [ ] **P4.T1.1:** `0003-cause.ts` — id `cause` (structure rule 4 ties id to filename), order 3,
    title "Make it move", `gameKind: 'plan'`, palette `['step-up','step-right']`, plan
    `['step-up','step-right','step-right','step-up']`, `flags: [2, 4]`, concept clip id `concept-cause`
  - [ ] **P4.T1.2:** the concept line is D8's sentence, with no abstraction in it
- [ ] **P4.T2: it joins the curriculum** — covers: FR-1, FR-9
  - [ ] **P4.T2.1:** added to `lessons` in `content/lessons/index.ts`; the `LessonCard` for `cause`
    already exists at order 3 and is left untouched, and the curriculum still holds six stops
- [ ] **P4.T3: star, unlock and the celebration** — covers: FR-9, FR-10, AC-9, AC-10
  - [ ] **P4.T3.1:** completing the last leg records the star, keeps the other two, unlocks node 4
    and survives a remount
  - [ ] **P4.T3.2:** the last arrival is celebrated before the concept beat, which speaks
    `concept-cause` once and once more on replay; flag 1 gets the flag wave only
- [ ] **P4.T4: nothing is printed, and the docs agree** — covers: FR-11, AC-10, NFR-4, NFR-5
  - [ ] **P4.T4.1:** the lesson subtree's text contains neither `step-` nor `walker`; GO is a button
    with an accessible name and no visible text
  - [ ] **P4.T4.2:** `src/MAP.md`, `tech-stack.md` and `product.md` describe plan-then-run in legs,
    the palette/plan split and the GO control
