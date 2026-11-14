# Make it move — Implementation Plan

> **Branch:** `feat/20261114-lesson-three-make-it-move`
> **Base:** `main` @ `ab08c1a`
> **Autonomy:** ready
> **Decisions:** D1, D2, D3, D4, D5, D6, D7, D8
> **Effort:** 3

Every phase ends in `bun run verify` — typecheck → lint → build → test — which is the only command
that proves a phase in this project. No package is added by any phase; `Dependencies: none` is meant
literally.

The mechanic is one idea in three layers: the content contract learns that a plan may be longer than
the palette (phase 1), the engine and the game turn that plan into movement (phase 2), and the
curriculum, its star and the docs adopt it (phase 3).

## Phase 1: The contract learns palette vs plan

- **Goal:** a lesson can name two arrows and plan four steps, and a malformed lesson still fails at
  import time.
- **Depends on:** none
- **Covers:** FR-2, AC-2
- **Touches:** `src/content/lesson.ts`, `src/content/lesson.test.ts` (new),
  `src/content/lessons/0001-order.ts`, `src/content/lessons/0002-repeat.ts`
- **Dependencies:** none
- **Decisions:** D2
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P1.T1: the contract** — covers: FR-2
  - [ ] **P1.T1.1:** `GameSpec.solution` documents itself as the plan and is allowed to be longer
    than `cards`; `cards` documents itself as the palette
  - [ ] **P1.T1.2:** `assertLesson` keeps rejecting a duplicate card, an empty plan and a plan step
    outside the palette, and stops requiring the plan to be the same length as the palette
- [ ] **P1.T2: the existing lessons still say what they mean** — covers: FR-2
  - [ ] **P1.T2.1:** lesson 1 and lesson 2 are unchanged in behaviour; their comments name palette
    and plan where they used to say "solution"
- [ ] **P1.T3: tests for the new rule** — covers: AC-2
  - [ ] **P1.T3.1:** a four-step plan over a two-card palette is accepted; a duplicate card, an empty
    plan and an unknown step each throw with the lesson's id
  - [ ] **P1.T3.2:** every shipped lesson still passes `assertLesson`, asserted through the
    curriculum list so a later lesson cannot skip the rule

## Phase 2: The run engine and the plan game

- **Goal:** a plan drawn on the road runs with one press of GO, and a plan that stops short stops
  honestly.
- **Depends on:** Phase 1
- **Covers:** FR-3, FR-4, FR-5, FR-6, AC-3, AC-4, AC-5, AC-6, NFR-1
- **Touches:** `src/world/`, `src/games/plan/`, `src/games/registry.ts`
- **Dependencies:** none
- **Decisions:** D1, D4, D5, D6
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P2.T1: the engine** — covers: FR-5, FR-6, D1
  - [ ] **P2.T1.1:** `world/run.ts` — `runPlan(route, plan, { onStep, onStuck, onArrive })`: walks
    the road one cell per `STEP_MS` while the plan's next step is the road's next cell, stops at the
    end of the plan, and stops early where the road does not continue
  - [ ] **P2.T1.2:** the engine returns a cancel function that clears its timers, and never calls
    `onArrive` twice
- [ ] **P2.T2: the game** — covers: FR-4, FR-5, D5, D6
  - [ ] **P2.T2.1:** `games/plan/PlanGame.tsx` renders the road through `Track`, the palette as
    buttons, a GO pad, and draws the pending plan on the road ahead of the walker
  - [ ] **P2.T2.2:** tapping a card appends; tapping a planned step removes it and the steps after;
    palette taps stop appending at the road's step count
- [ ] **P2.T3: running it** — covers: FR-5, FR-6
  - [ ] **P2.T3.1:** GO starts the run, is disabled while running, ignores a second press, and
    reports completion once on arrival
  - [ ] **P2.T3.2:** a short or wrong plan halts where the road ends, reports nothing, and leaves the
    plan editable; unmounting mid-run cancels the timers
- [ ] **P2.T4: register the kind** — covers: FR-5
  - [ ] **P2.T4.1:** one entry in `games/registry.ts` mapping `plan` to the component; `GameKind`
    gains `'plan'` (structure rule 5 reads the registry)
- [ ] **P2.T5: styles and motion** — covers: NFR-1
  - [ ] **P2.T5.1:** GO and the palette use `--tap-target`; the walk respects
    `prefers-reduced-motion: reduce` with a per-cell colour flash

## Phase 3: Lesson 3, its star, the unlock and the docs

- **Goal:** node 3 is playable, earns a star, unlocks node 4, and the three documents describe the
  new mechanic.
- **Depends on:** Phase 2
- **Covers:** FR-1, FR-7, FR-8, FR-9, AC-1, AC-7, AC-8, AC-9, NFR-4, NFR-5
- **Touches:** `src/content/lessons/`, `src/App*.test.tsx`, `src/MAP.md`,
  `conductor/tech-stack.md`, `conductor/product.md`
- **Dependencies:** none
- **Decisions:** D3, D7, D8
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P3.T1: the lesson data** — covers: FR-1, D3, D7
  - [ ] **P3.T1.1:** `0003-cause.ts` — id `cause` (structure rule 4 ties id to filename), order 3,
    title "Make it move", `gameKind: 'plan'`, palette `['step-up','step-right']`, plan
    `['step-up','step-right','step-up','step-right']`, concept clip id `concept-cause`
  - [ ] **P3.T1.2:** the concept line is D7's sentence, with no abstraction in it
- [ ] **P3.T2: it joins the curriculum** — covers: FR-1, FR-7
  - [ ] **P3.T2.1:** added to `lessons` in `content/lessons/index.ts`; the `LessonCard` for `cause`
    already exists at order 3 and is left untouched, and the curriculum still holds six stops
- [ ] **P3.T3: star, unlock and the celebration** — covers: FR-7, FR-8, AC-7, AC-8
  - [ ] **P3.T3.1:** completing lesson 3 records its star, keeps the other two, unlocks node 4 and
    survives a remount
  - [ ] **P3.T3.2:** the arrival is celebrated before the concept beat, which speaks `concept-cause`
    once and once more on replay
- [ ] **P3.T4: nothing is printed, and the docs agree** — covers: FR-9, AC-9, NFR-4, NFR-5
  - [ ] **P3.T4.1:** the lesson subtree's text contains neither `step-` nor `walker`; GO is a button
    with an accessible name and no visible text
  - [ ] **P3.T4.2:** `src/MAP.md`, `tech-stack.md` and `product.md` describe plan-then-run, the
    palette/plan split and the GO control
