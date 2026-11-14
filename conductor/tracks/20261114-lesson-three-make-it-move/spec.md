# Make it move

## Overview

Lesson 3 of six. The child composes a short plan of arrows on the road, presses **one** GO pad, and
watches the walker carry out the whole plan — several moves from a single press. The road turns two
corners and ends at a flag.

It is the curriculum's cause-and-effect lesson: the cause is one deliberate press, the effect is a
chain of movement the child can watch happen without touching anything.

## Problem / Motivation

Lessons 1 and 2 act on every tap: the child moves something directly, and the walker is the finger's
puppet. *Cause and effect* is a different idea — one event sets off a sequence that is no longer
under the finger. Nothing shipped so far can show it, because a per-tap game has no moment where the
child is not the one moving the walker.

The world already has the vocabulary this needs: one walker, arrows whose direction is honest, a
drawn road, a flag, and an arrival celebration. So lesson 3 adds a mechanic rather than art, which is
exactly what the one-world decision was for.

## Goals and Success Metrics

- The child builds a four-step plan from two arrows, presses GO once, and the walker makes all four
  moves without another tap.
- He can change his plan after a wrong one, and a failed plan costs him nothing.
- The road turns two corners, and its flag is not reachable by any single arrow — a plan is
  therefore unavoidable.
- Three stars on the map, node 4 unlocked, both surviving a reload.
- `bun run verify` exits 0, with no new dependency.

## Scope

In scope:

- The content contract learns the difference between a **palette** and a **plan**: `cards` may be
  shorter than `solution`, so a four-step plan can be built from two arrows.
- A run engine in `src/world/` that executes a plan one cell per `STEP_MS` and stops at the end of
  the road.
- A new game kind `plan`: tap a card to append a step, tap a planned step to remove it and the ones
  after it, one GO pad to run the plan.
- Lesson 3's content in `0003-make-it-move.ts`, registered as order 3.
- Its star, node 4's unlock, and both surviving a reload.
- Docs: `src/MAP.md`, `conductor/tech-stack.md`, `conductor/product.md`.

Out of scope:

- New sprites. The palette is arrows the world already draws; the GO pad is a control, not a picture
  a lesson may name.
- Lessons 4–6 and their nodes.
- A heading-based walker (turning arrows), walls, obstacles, gates, an undo stack, a level editor.
- Progress schema change.
- Deployment. Publishing is the parent's request, never a phase.

## Functional Requirements

- **FR-1** — Lesson 3 is content, not code: `src/content/lessons/0003-cause.ts`, id `cause`, order
  3, title "Make it move", `gameKind: 'plan'`, palette `['step-up', 'step-right']`, plan
  `['step-up', 'step-right', 'step-up', 'step-right']`, and a concept line in the child's words. The
  id and title are already on the map — `curriculum` has `{ id: 'cause', title: 'Make it move',
  order: 3 }` — and structure rule 4 requires the file to be named after the id, so this track adds
  content to the existing stop rather than renaming it or adding one.
- **FR-2** — The contract separates a palette from a plan: `assertLesson` accepts a plan longer
  than the palette, and still rejects a duplicate card, an empty plan, and a plan step that is not
  one of the lesson's cards.
- **FR-3** — The road is the plan read as directions, via `routeFor`, so it turns two corners and
  its flag sits two columns right and two rows up from the start: no single arrow reaches it.
- **FR-4** — Tapping a palette card appends that step to the plan; tapping a planned step on the
  road removes it and every step after it; the plan is drawn on the road ahead of the walker, and
  the plan never grows past the road's number of steps.
- **FR-5** — One GO pad runs the plan: the walker takes each planned step in order, one cell per
  `STEP_MS`, and completion is reported exactly once when he stands on the flag. GO is disabled
  while a run is in flight, and a second press during it changes nothing.
- **FR-6** — A plan that does not reach the flag runs literally and stops where the road ends. The
  child never leaves the road, nothing is lost, and the plan stays editable so he can press GO
  again.
- **FR-7** — Completing lesson 3 earns its star, keeps lessons 1 and 2's stars, unlocks node 4, and
  a reload shows three stars with node 4 activatable.
- **FR-8** — On completion the arrival is celebrated for the existing `CELEBRATE_MS` beat, and the
  concept beat then speaks the lesson's line once, with replay speaking it once more.
- **FR-9** — No lesson screen renders a sprite id or an instruction as text. The only visible words
  are the lesson title and the concept line; the GO pad carries no visible label.

## Non-Functional Requirements

- **NFR-1** — Every tap produces a visible response within 100 ms. The run is state- and
  CSS-driven, and `prefers-reduced-motion: reduce` replaces movement between cells with a per-cell
  colour flash that keeps the same timing.
- **NFR-2** — Every tappable sprite stays at least 72×72 CSS px with at least 16 px between targets,
  using the existing tokens.
- **NFR-3** — `bun run verify` stays under 60 seconds and built JS stays under 200 KB gzipped
  (73.73 kB at the previous merge, so the budget is 2.7×).
- **NFR-4** — No new runtime dependency: the GO pad is inline SVG, the engine is plain TypeScript.
- **NFR-5** — The lesson stays completable with sound off or no voice: the run is visible, the
  concept line is on screen, and a narration port that throws does not block completion.

## Acceptance Criteria

- **AC-1** — `findLesson('cause')` returns lesson 3 with its palette and its four-step plan, and the
  curriculum still holds exactly six stops with `cause` at order 3 (covers FR-1).
- **AC-2** — `assertLesson` accepts the four-step plan over a two-card palette, and still throws for
  a duplicate card, an empty plan, and a plan step outside the palette (covers FR-2).
- **AC-3** — The rendered road has five cells at `(0,0) (0,-1) (1,-1) (1,-2) (2,-2)` with exactly one
  flag, on the last (covers FR-3).
- **AC-4** — Tapping a card appends its step to the road ahead; tapping a planned step removes it and
  the ones after it; the plan never exceeds the road's step count (covers FR-4).
- **AC-5** — One GO press moves the walker cell by cell to the flag and reports completion exactly
  once; a second press during the run adds nothing (covers FR-5).
- **AC-6** — A plan that stops short leaves the walker on the last cell the road reaches, reports no
  completion, and the plan is still editable (covers FR-6).
- **AC-7** — After completing lessons 1, 2 and 3 and remounting, the store reports three stars and
  node 4 is activatable (covers FR-7).
- **AC-8** — The concept line is spoken once after the celebration, and once more on replay (covers
  FR-8).
- **AC-9** — For lesson 3 the rendered subtree's text contains neither `step-` nor `walker`, and the
  GO pad is a button with an accessible name and no visible text (covers FR-9).

## Decisions

- **D1 — The mechanic** → plan-then-run. The child composes instructions and one press executes them
  all. A per-tap game cannot teach cause and effect, because the walker never does anything the
  finger did not just do.
- **D2 — Palette vs plan** → `cards` is the palette; `solution` is the plan and may be longer. That
  is the smallest contract change that makes a four-step plan buildable from two arrows, and it is
  what a queue is by definition.
- **D3 — The plan's shape** → `up, right, up, right` from a two-arrow palette: two corners, ending
  two columns right and two rows up, so the flag is never one arrow away. The adjacency problem the
  grid review found cannot recur here.
- **D4 — What a wrong plan does** → it runs literally and stops at the end of the road: no reset, no
  penalty, no dead end. Arrows stay honest, and the child always has a next move.
- **D5 — The GO pad** → a drawn button in `src/games/plan/`, deliberately not a `PictureId`, because
  it is a control rather than a picture a lesson may name.
- **D6 — Editing** → append by tapping a palette card, remove by tapping a planned step on the road
  (and everything after it). The plan lives in exactly one place — the road — so what he sees is what
  will run.
- **D7 — The concept line** → "You pressed go — and it went! One push, and it did every step you
  gave it." It names the cause in the child's words; "event" and "trigger" stay the parent's
  vocabulary.
- **D8 — Star and unlock** → no store change: lesson 3's completion earns its star and node 4 opens
  by the existing selector rule.

## Edge Cases and Failure Modes

- GO pressed with an empty plan: nothing happens, and nothing scolds him; GO stays available.
- GO pressed while a run is in flight: ignored, so one press is one run.
- Back pressed mid-run: timers are cleared, no star is written, no partial plan is saved.
- Plan at the road's step count: palette taps stop appending rather than growing a plan that could
  never fit.
- A plan that walks off the road: the run halts at the last cell; the plan is untouched and editable.
- Reduced motion on: the walker appears in each cell with a colour flash; state never depends on
  movement.
- Storage unavailable or corrupt: the existing fallback returns a fresh profile; three stars read as
  zero and nothing throws.
- Lessons 4–6: still locked, still without content.

## Dependencies

- Tracks: `20261114-one-world-lesson-two` — merged at `ab08c1a`; this track builds on its grid,
  `routeFor`, ribbon, `STEP_MS`, `CELEBRATE_MS` and the arrival celebration.
- External: no new package.

## Open Questions and Assumptions

- **Turns of the road, not turns of the walker** → assumed. Turn arrows need a walker with a heading
  and two new sprites; the parent asked for turns and a destination, and a road with two corners
  delivers both using the arrows the world already draws. A heading-based walker is a larger idea
  and would be its own decision.
- **Four steps per press** → assumed: two is trivial and six is past a four-year-old's patience.
- **GO is always available** → assumed: no separate "check" step, because a check is a second
  decision and the lesson's whole point is one press → many moves.
- **Node 3 becomes playable** → confirmed: the stop already exists as `{ id: 'cause', title: 'Make
  it move', order: 3 }` and is unlocked by completing lesson 2, so this track gives it content rather
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
