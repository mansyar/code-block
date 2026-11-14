# Make it move

## Overview

Lesson 3 of six. The road has **two flags**. The child plans the first part of the walk, presses GO,
and the walker stops at the first flag. He then plans the second part from where the walker stands,
presses GO again, and the walker finishes at the second flag.

It is the curriculum's cause-and-effect lesson: each press is one cause and one visible march, the
child writes both plans himself, and the second one starts from a world his first plan changed.

## Problem / Motivation

Lessons 1 and 2 act on every tap: the child moves something directly, so the walker is always the
finger's puppet and there is no moment where he causes something without touching it.

A single long run ("one press, four moves") would show cause and effect once, as one undifferentiated
gulp. Two flags split it into **two matched pairs** — a plan, a press, a visible arrival — and give
the child a win in the middle of the lesson instead of only at the end. The second leg also has to
start from a moved walker, which is the honest shape of a program: you write a part, run it, and then
write the next part from wherever you now are.

The world already has the vocabulary this needs: one walker, arrows whose direction is honest, a
drawn road, flags and an arrival celebration. Lesson 3 adds a mechanic, not art.

## Goals and Success Metrics

- The child plans two cells, presses GO, and watches the walker reach flag 1 without another tap.
- He then plans the next two cells from the flag and presses GO again to reach flag 2.
- He can change either plan after a wrong one, and a failed plan costs him nothing but a retry.
- Neither flag is reachable from the start by a single arrow, so planning is unavoidable.
- Three stars on the map, node 4 unlocked, both surviving a reload.
- `bun run verify` exits 0, with no new dependency.

## Scope

In scope:

- The content contract learns the difference between a **palette** and a **plan** (`cards` may be
  shorter than `solution`), and learns that a lesson's road may be walked in **legs** (`flags`).
- A run engine in `src/world/` that walks a plan one cell per `STEP_MS`, stopping at the end of the
  plan, at the leg's flag, or where the road does not continue.
- `Track` draws a flag at every leg boundary, not only at the end of the road.
- A new game kind `plan`: tap cards to append steps, tap a planned step to remove it and the ones
  after it, one GO pad per leg; the plan is cleared between legs, the walker is not.
- Lesson 3's content in `0003-cause.ts`, registered as order 3 (`cause`).
- Its star, node 4's unlock, and both surviving a reload.
- Docs: `src/MAP.md`, `conductor/tech-stack.md`, `conductor/product.md`.

Out of scope:

- New sprites. The palette is arrows the world already draws; the GO pad is a control, not a picture
  a lesson may name.
- Lessons 4–6 and their nodes.
- A heading-based walker (turning arrows), walls, obstacles, gates, an undo stack, a level editor.
- Editing a leg after its GO has run it: a leg is written, run once, and then the next leg begins.
- Progress schema change.
- Deployment. Publishing is the parent's request, never a phase.

## Functional Requirements

- **FR-1** — Lesson 3 is content, not code: `src/content/lessons/0003-cause.ts`, id `cause`, order 3,
  title "Make it move", `gameKind: 'plan'`, palette `['step-up', 'step-right']`, plan
  `['step-up', 'step-right', 'step-up', 'step-right']`, `flags: [2, 4]`, and a concept line in the
  child's words. The stop already exists on the map; this track gives it content.
- **FR-2** — The contract separates a palette from a plan: `assertLesson` accepts a plan longer than
  the palette, and still rejects a duplicate card, an empty plan, and a plan step that is not one of
  the lesson's cards.
- **FR-3** — A lesson may divide its plan into legs: `flags` is an optional list of plan positions,
  each strictly greater than the last, the last equal to the plan's length; a lesson without it has
  one leg ending at the flag. `assertLesson` rejects an empty list, a repeated or descending
  position, a position past the end of the plan, and a last position that is not the end.
- **FR-4** — The road is the plan read as directions (`routeFor`), so it turns two corners and ends
  two columns right and two rows up from the start; `Track` draws a flag at every leg boundary, so
  lesson 3 shows two flags and one flag-less leg boundary cannot exist.
- **FR-5** — Tapping a palette card appends that step to the **current leg's** plan; tapping a planned
  step on the road removes it and every step after it; the leg's plan never grows past that leg's
  length. The plan is drawn on the road ahead of the walker.
- **FR-6** — One GO pad runs the current leg: the walker takes each planned step in order, one cell
  per `STEP_MS`, and stops at that leg's flag. Completion is reported exactly once, and only after
  the **last** leg. GO is disabled while a run is in flight, and a second press during it changes
  nothing.
- **FR-7** — Reaching an intermediate flag is a beat, not an ending: the flag waves, the walker
  stays, the leg's plan is cleared, the palette is available again and the walker does not move back
  to the start. The next leg is planned from the cell he reached.
- **FR-8** — A plan that does not follow the road runs literally and stops where the road does not
  continue; the child never leaves the road, nothing is lost, and the leg stays editable so he can
  press GO again.
- **FR-9** — Completing the last leg earns lesson 3's star, keeps lessons 1 and 2's stars, unlocks
  node 4, and a reload shows three stars with node 4 activatable.
- **FR-10** — On reaching the last flag, the arrival is celebrated for the existing `CELEBRATE_MS`
  beat, and the concept beat then speaks the lesson's line once, with replay speaking it once more.
- **FR-11** — No lesson screen renders a sprite id or an instruction as text. The only visible words
  are the lesson title and the concept line; the GO pad carries no visible label.

## Non-Functional Requirements

- **NFR-1** — Every tap produces a visible response within 100 ms. Both runs are state- and
  CSS-driven, and `prefers-reduced-motion: reduce` replaces movement between cells with a per-cell
  colour flash that keeps the same timing.
- **NFR-2** — Every tappable sprite stays at least 72×72 CSS px with at least 16 px between targets,
  using the existing tokens.
- **NFR-3** — `bun run verify` stays under 60 seconds and built JS stays under 200 KB gzipped
  (73.73 kB at the previous merge, so the budget is 2.7×).
- **NFR-4** — No new runtime dependency: the GO pad is inline SVG, the engine is plain TypeScript.
- **NFR-5** — The lesson stays completable with sound off or no voice: both runs are visible, the
  concept line is on screen, and a narration port that throws does not block completion.

## Acceptance Criteria

- **AC-1** — `findLesson('cause')` returns lesson 3 with its palette, its four-step plan and
  `flags: [2, 4]`, and the curriculum still holds exactly six stops with `cause` at order 3 (covers
  FR-1).
- **AC-2** — `assertLesson` accepts the four-step plan over a two-card palette and rejects a
  duplicate card, an empty plan and a plan step outside the palette (covers FR-2).
- **AC-3** — `assertLesson` accepts `flags: [2, 4]` and rejects `[]`, `[2, 2]`, `[4, 2]`, `[2, 5]` and
  `[2]` for a four-step plan; a lesson without `flags` is accepted as a single leg (covers FR-3).
- **AC-4** — The rendered road for lesson 3 has five cells at `(0,0) (0,-1) (1,-1) (1,-2) (2,-2)`
  with exactly two flags, on cells 2 and 4 (covers FR-4).
- **AC-5** — Leg 1 accepts at most two planned steps; a third tap appends nothing; tapping a planned
  step removes it and the steps after it (covers FR-5).
- **AC-6** — One GO press in leg 1 moves the walker exactly two cells to flag 1 and does **not**
  report completion; the walker's cell index is 2 afterwards and the leg's plan is empty (covers
  FR-6, FR-7).
- **AC-7** — Leg 2 plans from the cell the walker reached, and one GO press moves him the last two
  cells to flag 2 and reports completion exactly once (covers FR-6, FR-7).
- **AC-8** — A plan in either leg that does not follow the road leaves the walker where the road stops
  and reports no completion; the leg is still editable (covers FR-8).
- **AC-9** — After completing lessons 1, 2 and 3 and remounting, the store reports three stars and
  node 4 is activatable (covers FR-9).
- **AC-10** — The concept line is spoken once after the celebration and once more on replay, and
  lesson 3's subtree text contains neither `step-` nor `walker`, with GO a button that has an
  accessible name and no visible text (covers FR-10, FR-11).

## Decisions

- **D1 — The mechanic** → plan-then-run, in **legs**. The child writes a plan, presses GO, watches it
  run to a flag, then writes the next plan from where the walker stands. A per-tap game cannot teach
  cause and effect, and one long run would show it only once.
- **D2 — Palette vs plan** → `cards` is the palette; `solution` is the whole road, and may be longer
  than the palette. That is the smallest contract change that lets four steps be drawn from two
  arrows.
- **D3 — The road and the flags** → `up, right, up, right` from `(0,0)`, flags at plan positions 2
  and 4, so the walk stops at `(1,-1)` and finishes at `(2,-2)`. Neither flag is reachable from the
  start by a single arrow, so the adjacency problem the grid review found cannot recur, and the
  midpoint is a real place rather than a marker at the end.
- **D4 — A leg's plan is cleared when the leg ends, the walker is not.** That is what makes the two
  legs two causes rather than one long programme, and it keeps him where the first plan put him.
- **D5 — What a wrong plan does** → it runs literally and stops where the road stops: no reset, no
  penalty, no dead end. Arrows stay honest and the child always has a next move.
- **D6 — The GO pad** → a drawn button in `src/games/plan/`, deliberately not a `PictureId`, because
  it is a control rather than a picture a lesson may name.
- **D7 — Editing** → append by tapping a palette card, remove by tapping a planned step on the road
  (and everything after it), capped at the current leg's length. The plan lives in exactly one place —
  the road — so what the child sees is what will run.
- **D8 — The concept line** → "You said go, and it went. Then you said go again — and it went
  again!" It names both causes in the child's words; "event" and "trigger" stay the parent's
  vocabulary.
- **D9 — Star and unlock** → no store change. Lesson 3's star is earned at the last flag only, and
  node 4 opens by the existing selector rule.

## Edge Cases and Failure Modes

- GO pressed with an empty plan: nothing happens and nothing scolds him; GO stays available.
- GO pressed while a run is in flight: ignored, so one press is one run.
- A leg whose plan is shorter than the leg: the run stops where the plan ends, which is mid-leg, and
  nothing is reported; the child adds the missing steps.
- A plan that walks off the road: the run halts at the last cell; the plan is untouched and editable.
- Back pressed mid-run: timers are cleared, no star is written, no partial plan is saved.
- Reduced motion on: the walker appears in each cell with a colour flash; state never depends on
  movement.
- Storage unavailable or corrupt: the existing fallback returns a fresh profile; three stars read as
  zero and nothing throws.
- Lessons 4–6: still locked, still without content.

## Dependencies

- Tracks: `20261114-one-world-lesson-two` — merged at `ab08c1a`; this track builds on its grid,
  `routeFor`, ribbon, flags, `STEP_MS`, `CELEBRATE_MS` and the arrival celebration.
- External: no new package.

## Open Questions and Assumptions

- **Turns of the road, not turns of the walker** → assumed. Turn arrows need a walker with a heading
  and two new sprites; the parent asked for turns and a destination, and a road with two corners
  delivers both using the arrows the world already draws. A heading-based walker is a larger idea and
  would be its own decision.
- **Two steps per leg** → assumed: it is the smallest leg that still needs a plan, it gives two
  matched cause/effect pairs, and four steps in one go would be past a four-year-old's patience.
- **GO is always available** → assumed: no separate "check" step, because a check is a second
  decision and the lesson's point is press → movement.
- **Node 3 becomes playable** → confirmed: the stop already exists as `{ id: 'cause', title: 'Make it
  move', order: 3 }` and is unlocked by completing lesson 2, so this track gives it content rather
  than adding or renaming a stop. The id stays `cause` because structure rule 4 ties a lesson id to
  its filename.

## References

- `conductor/product.md` — the six-concept curriculum; lesson 3 is cause and effect.
- `conductor/product-guidelines.md` — no-text, 72 px, no-dead-end and reduced-motion rules.
- `conductor/tech-stack.md` — the seams, the six navigation rules, D-TS10 (one world, arrows mean
  directions).
- `conductor/workflow.md` — `bun run verify` as the one proving command.
- `conductor/archive/20261114-one-world-lesson-two/spec.md` — the grid, the ribbon and the arrival
  celebration this track builds on.
