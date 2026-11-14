# If it is red — Implementation Plan

> **Branch:** `feat/20261114-lesson-four-if-it-is-red`
> **Base:** `main` @ `d8654a8`
> **Autonomy:** ready
> **Decisions:** D1, D2, D3, D4, D5, D6, D7, D8
> **Effort:** 3

Every phase ends in `bun run verify` — typecheck → lint → build → test — which is the only command
that proves a phase in this project. No package is added by any phase; `Dependencies: none` is meant
literally.

The idea is one rule in three layers: the contract and the road learn that a step can be taken twice
(phase 1), a game draws the red pad and walks the rule (phase 2), and the lesson, its star and the
docs adopt it (phase 3). The rule lives in the road, so the child reads it before he presses GO
rather than discovering it afterwards.

## Phase 1: The plan can say "twice", and the road grows

**Goal:** a lesson can name the plan positions whose step is taken twice, and its route contains the
extra cells — while every lesson that names none is byte-for-byte what it is today.

- **Depends on:** none
- **Covers:** FR-2, FR-3, FR-4, FR-11, AC-2, AC-3, AC-9
- **Touches:** `src/content/lesson.ts`, `src/content/lesson.test.ts`, `src/world/path.ts`,
  `src/world/path.test.ts`
- **Dependencies:** none
- **Decisions:** D2, D3
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P1.T1: the field and the kind** — `GameSpec.twice?: readonly number[]` documented as plan
  positions counted from 1 (the same convention as `flags`), absent meaning no step repeats;
  `GameKind` gains `'condition'`. — covers: FR-2
- [ ] **P1.T2: validate it at import time** — `assertTwice` rejects an empty list, a position below 1,
  a position past the end of the plan, a duplicate and a descending pair, each with the lesson's id;
  a lesson with no `twice` is accepted unchanged. — covers: FR-4
- [ ] **P1.T3: the road expands** — `routeFor` inserts the extra cell for every repeated position, in
  that step's own direction, so a plan of `n` steps with `k` repeats has `n + 1 + k` cells; `tracePath`
  and the step geometry are reused rather than duplicated. — covers: FR-3, D3
- [ ] **P1.T4: tests for the rule and for the lessons already shipped** — route length and each extra
  cell's direction for a doubled plan, two adjacent repeats on one arrow, a repeat on the last step,
  and the assertion that lessons 1–3 still produce exactly `plan.length + 1` cells. — covers: AC-2,
  AC-3, AC-9

**Status:** pending

---

## Phase 2: A red pad, and a walk that obeys it

**Goal:** `Track` can mark the tiles a repeat happens on, and a `condition` game builds a plan, shows
those pads, and walks the plan with one cell per beat — two cells when the pad says again.

- **Depends on:** Phase 1
- **Covers:** FR-5, FR-6, FR-7, NFR-2, NFR-4, NFR-5, AC-4, AC-5
- **Touches:** `src/world/Track.tsx`, `src/world/Track.module.css`, `src/world/Track.test.tsx`,
  `src/world/run.ts`, `src/world/run.test.ts`, `src/games/condition/`, `src/games/registry.ts`
- **Dependencies:** none
- **Decisions:** D1, D4, D5
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P2.T1: the pad on the tile** — `Track` takes `pads?: readonly number[]` as route indices and
  marks each with `data-pad="red"`; `Track.module.css` draws it as a raised diamond in
  `--colour-berry`, above the band, below the walker, static and not a tap target. — covers: FR-5,
  NFR-2, NFR-4, D4
- [ ] **P2.T2: a run that walks the road, not the plan** — `run.ts` gains `runRoad({ route, from, to,
  stepMs, onStep, onHalt, onArrive })`, which advances one route index per `STEP_MS` and is cancelable
  like `runPlan`; `runPlan` keeps its behaviour and its tests. — covers: FR-6
- [ ] **P2.T3: the condition game** — `src/games/condition/ConditionGame.tsx` renders `Track` with the
  lesson's pads, a palette that appends, a tap-to-remove plan capped at its own length, and the GO pad;
  it maps each plan step to the one or two route cells it covers, halts honestly where the road stops,
  and reports completion once. — covers: FR-6, FR-7, D5
- [ ] **P2.T4: register and test the kind** — one entry in `src/games/registry.ts`; jsdom tests assert
  one pad per repeated position and none elsewhere, that a pad step advances two indices in two beats
  with an injected `stepMs`, that a plain step advances one, that removing a planned step truncates,
  and that GO is inert while the walk is running. — covers: AC-4, AC-5, NFR-5

**Status:** pending

---

## Phase 3: Lesson 4, its star, and the docs

**Goal:** stop 4 is playable as a road with one red pad, earns its star, opens node 5, is proved in a
browser, and the three documents describe the rule.

- **Depends on:** Phase 2
- **Covers:** FR-1, FR-8, FR-9, FR-10, NFR-3, AC-1, AC-6, AC-7, AC-8, AC-10
- **Touches:** `src/content/lessons/0004-condition.ts`, `src/content/lessons/index.ts`,
  `src/App.lessonFour.test.tsx`, `src/MAP.md`, `conductor/product.md`,
  `conductor/product-guidelines.md`,
  `conductor/tracks/20261114-lesson-four-if-it-is-red/verification/phase-3.md`
- **Dependencies:** none
- **Decisions:** D6, D7, D8
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P3.T1: the lesson data** — `0004-condition.ts` with id `condition` (structure rule 4 ties the id
  to the filename), order 4, title "If it is red", `gameKind: 'condition'`, palette
  `['step-up', 'step-right']`, plan `['step-right', 'step-up', 'step-right', 'step-right']`, `twice:
  [2]`, concept clip id `concept-condition` and D8's sentence; added to `lessons` in
  `content/lessons/index.ts`. — covers: FR-1, FR-10, D6, D8
- [ ] **P3.T2: star, unlock and the celebration** — an app-level test completes lesson 4 and asserts its
  star is recorded, lessons 1–3's stars survive, node 5 is unlocked, and that the arrival is
  celebrated before the concept beat; storage stays under `code-block.progress.v1`. — covers: FR-8,
  AC-7, D7
- [ ] **P3.T3: prove it in the browser** — with the dev server on `0.0.0.0:3000`, record the road's
  six cells, the one red pad and its silhouette, the walk's beats (`0 → 1 → 2 → 3 → 4 → 5`, the pad's
  step taking two), the cell size against the 72 px floor, and the visible text (`←`, "If it is red");
  keep screenshots under `.conductor/evidence/`. — covers: AC-6, AC-8
- [ ] **P3.T4: update the docs** — `src/MAP.md`'s add-a-lesson recipe mentions the repeat rule and
  `src/games/condition/`; `conductor/product.md` adds lesson 4 to the shipped-lessons sentence;
  `conductor/product-guidelines.md` states the red-pad rule (raised diamond, colour plus shape, never
  a tap target). — covers: FR-5, FR-9
- [ ] **P3.T5: write the evidence file** — `verification/phase-3.md` holds the browser table, the
  screenshot paths, the files changed and the AC mapping. — covers: AC-6, AC-8, AC-10

**Status:** pending

---

## Acceptance map

| AC | Phase | Proof |
|---|---|---|
| AC-1 | 3 | P3.T1 content test through the curriculum |
| AC-2 | 1 | P1.T3, P1.T4 route lengths and directions |
| AC-3 | 1 | P1.T2, P1.T4 malformed-rule tests |
| AC-4 | 2 | P2.T1, P2.T4 pad assertions |
| AC-5 | 2 | P2.T2, P2.T4 beat assertions with injected `stepMs` |
| AC-6 | 3 | P3.T3 browser measurements and screenshots |
| AC-7 | 3 | P3.T2 app test |
| AC-8 | 3 | P3.T3 visible text and accessibility tree |
| AC-9 | 1 | P1.T4 shipped-route assertions |
| AC-10 | 1, 2, 3 | `bun run verify` in every phase; structure rules inside it |

**Total:** 3 phases, 13 tasks.
