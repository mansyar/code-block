# One world, lesson two

## Overview

The curriculum gets a single visual world — one character, arrows, a path — and its second
playable lesson. Lesson 1 is rebuilt inside that world as three arrow steps the child puts in
order; lesson 2 is "Do it again", where one tap makes the character walk three times. Both
lessons share the same sprites, the same path and the same walker.

After this track the app has two lessons on one map in one language, and lessons 3–6 have the
vocabulary they need: nothing new has to be drawn to teach cause-and-effect with the same actor.

## Problem / Motivation

The slice shipped one lesson with bread, cheese and a top slice. Fine for teaching order, but it
gives lessons 2–6 nothing to build on: every new concept would need its own objects, its own art
and its own internal logic, and the child would meet a different world at every node.

A single character on a single path fixes all three. The world stays familiar, so the only new
thing on screen is the concept itself — which is the whole reason a four-year-old can learn six
ideas from six games. It is also cheaper: three shared sprites instead of six bespoke sets.

Lesson 2 specifically is the first concept that cannot be shown with objects. "Again and again"
is a pattern in time, so it needs an actor that acts twice: one instruction, three repeats.

## Goals and Success Metrics

- The child plays lesson 1 in the new world and finishes it with the same taps-only effort as
  before: three cards, no text instructions.
- He plays lesson 2 straight after, taps its single arrow once, and watches the walker hop three
  times before the concept is spoken.
- Two stars on the map, node 3 unlocked, both surviving a reload.
- Adding lesson 3 later needs no new sprites — the actor, the arrow and the path already exist.
- Every phase's `bun run verify` exits 0 with no new dependency.

## Scope

In scope:

- The world's vocabulary: `walker`, `step-up`, `step-right`, `step-down` replace the three food
  pictures in the content contract and the picture registry.
- Lesson 1 (`order`) re-themed: three distinct arrow steps, ordered; its title and concept line
  rewritten in the world's words.
- A shared path component (`src/world/`) that draws the track and positions the walker, used by
  both games.
- The sequence game re-themed: each correct card moves the walker one cell forward; a wrong card
  still wobbles and moves nothing.
- Lesson 2 (`repeat`): one arrow card, one tap, three steps, then the concept beat.
- Lesson 2's star, its unlock of node 3 and both surviving a reload — through the existing store.
- Doc sync: `src/MAP.md`, `conductor/tech-stack.md`, `conductor/product.md`.

Out of scope:

- Lessons 3–6 content. Their nodes stay locked and their mechanics stay undesigned.
- Direction commands (arrows that turn the walker), a grid, a goal gate, a "go" button — those
  are lesson 3's cause-and-effect mechanics.
- Any new art beyond four inline SVGs; no audio files, no Chatterbox render (`D7`).
- Progress schema changes, streaks, resuming an interrupted lesson, a parent view.
- Deployment. Publishing is the parent's explicit request, never a phase.

## Functional Requirements

- **FR-1** — The lesson vocabulary is one actor and arrow steps: `PictureId` is exactly
  `walker | step-up | step-right | step-down`, and every id has a drawn component in
  `ui/pictures/registry.ts`, enforced by the registry's `Record<PictureId, …>` type.
- **FR-2** — Lesson 1 is re-themed on the path: it keeps id `order` and file `0001-order.ts`,
  shows three distinct arrow steps in an order that is not the solution order, and its title and
  concept line speak about the walker and the path rather than about food.
- **FR-3** — In lesson 1 every correct tap moves the walker exactly one cell forward along the
  track; a wrong tap leaves him where he is and wobbles the card; a placed card cannot be tapped
  again; reaching the last cell completes the game exactly once.
- **FR-4** — Lesson 2 (`repeat`) shows exactly one arrow card, and a single tap makes the walker
  take three steps along the track, one cell at a time, then reports completion exactly once.
- **FR-5** — On lesson 2's completion the concept beat opens and speaks its concept line through
  the narration port once, with the existing replay control re-speaking it from the start.
- **FR-6** — Completing lesson 2 records its star, leaves lesson 1's star intact, unlocks node 3,
  and a reload or new launch still shows two stars and node 3 activatable.
- **FR-7** — No lesson screen renders a sprite id, a card id or an instruction as text. The only
  visible words are the lesson title and the concept line; a lesson whose game is not registered
  shows its pictures, not its ids.
- **FR-8** — `src/MAP.md`, `conductor/tech-stack.md` and `conductor/product.md` describe the one
  world, the new `src/world/` directory and the re-themed curriculum, and the structure test's
  rule 6 passes with the new directory listed.

## Non-Functional Requirements

- **NFR-1** — Every tap produces a visible response within 100 ms. The walker's three-step walk
  uses CSS transitions only, and `prefers-reduced-motion: reduce` replaces the movement with a
  per-cell colour flash that keeps the same timing.
- **NFR-2** — Every tappable sprite stays at least 72×72 CSS px with at least 16 px between
  targets, and state-bearing shapes keep 3:1 contrast; the new sprites use the existing tokens.
- **NFR-3** — `bun run verify` stays under 60 seconds and built JS stays under 200 KB gzipped
  (72.24 KB at the previous track's merge, so the budget is 2.7×).
- **NFR-4** — No new runtime dependency: sprites are inline SVG components like the pictures they
  replace, and no package is added by this track.
- **NFR-5** — The lesson stays completable with sound off or no voice: the walk is visible, the
  concept line is on screen, and a narration port that throws does not block completion.

## Acceptance Criteria

- **AC-1** — The picture registry resolves all four ids, and a lesson naming a retired id
  (`bread`) fails typecheck (covers FR-1).
- **AC-2** — Rendering lesson 1 shows three arrow cards, in an order that is not its solution,
  each at least 72 px (covers FR-2, NFR-2).
- **AC-3** — Tapping lesson 1's solution order moves the walker one cell per tap (0 → 1 → 2 → 3),
  a wrong tap leaves the cell index unchanged, and completion is reported once (covers FR-3).
- **AC-4** — Lesson 2 renders exactly one card; one tap produces three walker steps and exactly
  one `onComplete`; a second tap mid-walk adds nothing (covers FR-4).
- **AC-5** — Completing lesson 2 sends the narration port its concept line exactly once, and
  replay sends it once more (covers FR-5).
- **AC-6** — After completing lesson 2 and remounting the app, the store reports two stars and
  node 3 is activatable (covers FR-6).
- **AC-7** — For each lesson, the rendered lesson subtree's text contains neither `step-` nor
  `walker` (covers FR-7).
- **AC-8** — `bun run verify` exits 0, and the structure test passes with `src/world/` present in
  `MAP.md` (covers FR-8, NFR-3).

## Decisions

- **D1** — The world's vocabulary → one actor plus three arrow steps replace bread, cheese and
  top slice. The type keeps its name `PictureId`, because it still names a picture; renaming it
  would touch eight files for no behaviour change.
- **D2** — Lesson 1's re-theme → same id `order`, same file `0001-order.ts`, title "Walk the
  path", cards shown as `step-down, step-up, step-right`, solution `step-up, step-right,
  step-down` — so the display order is still never the solution order.
- **D3** — The world's seam → a new `src/world/` directory holding the track and the walker's
  position, imported by both games. It is named `world` and not `shared` because structure rule 1
  forbids catch-all names.
- **D4** — Feedback on a correct tap → the walker moves one cell per correct card, with no
  separate "go" button. A confirm step would be a second decision per card for a child who
  already made one.
- **D5** — The repeat count → three steps, defined in the repeat game because the track has three
  cells. No new lesson-data field until a second repeat lesson needs a different count.
- **D6** — Lesson 2's data → `gameKind: 'repeat'`, `cards: ['step-right']`,
  `solution: ['step-right']`. One card satisfies `assertLesson`, which is what a single-instruction
  lesson should look like in data.
- **D7** — Narration → unchanged: the device voice behind the existing port, empty clip manifest,
  no Chatterbox render in this track. The parent chose this explicitly.
- **D8** — Progress → no schema change. `code-block.progress.v1` already stores a list of
  completed lesson ids, so a second lesson is data, not a migration.
- **D9** — Lesson 2's concept line → "You said it once, and it hopped again and again. Three
  times!" — concrete verbs, the idea named after the play, and the word "loop" left to the parent
  because product guidelines keep abstractions out of the spoken script.
- **D10** — The map → unchanged visually. Node labels come from the curriculum data, so
  re-theming lesson 1 renames its label with no component change.

## Edge Cases and Failure Modes

- A second tap on the repeat arrow while the walk is running: ignored, so one completion per
  lesson. The finished flag is a ref, exactly as the sequence game does it.
- Back control pressed mid-walk: the lesson unmounts, the timers are cleared, no star is written
  because completion never reported.
- Reduced motion on: the walker appears in each cell without travelling, with a colour flash;
  state never depends on movement.
- A lesson whose `gameKind` has no component: the pending state draws the lesson's sprites, never
  their ids (FR-7).
- A retired sprite id left in content: a type error at import time, before any test runs.
- Lessons 3–6: still cards without content; the map renders them locked and the walker does not
  appear there.
- Storage unavailable or corrupt: the existing fallback returns a fresh profile; two stars read
  as zero stars and nothing throws.

## Dependencies

- Tracks: `20261114-minimum-vertical-slice` — merged at `82fb192`; this track builds on its
  contract, registry, store and narration port.
- External: no new package. `react`, `vitest`, `@testing-library/react` and Biome already exist
  and are used as they are.

## Open Questions and Assumptions

- **The character** → assumed a chunky round creature drawn as inline SVG in
  `ui/pictures/Walker.tsx`, shown without a name — a name would be text, and text carries no
  meaning for this user.
- **The track's shape** → assumed three cells in a straight line, because a turn would require
  direction commands, which are lesson 3's mechanic.
- **Lesson titles** → assumed "Walk the path" and "Do it again". Titles are decoration for the
  parent; the child never needs them.
- **Art for lessons 3–6** → assumed none in this track. Their nodes stay locked and plain, and
  their sprites get drawn when their mechanics are designed.
- **The walk's timing** → assumed about 350 ms per cell, which is slow enough to follow and short
  enough that the concept beat follows a tap by under two seconds.

## References

- `conductor/product.md` — the six-concept curriculum this track extends.
- `conductor/product-guidelines.md` — no-text, 72 px, no-dead-end and reduced-motion rules.
- `conductor/tech-stack.md` — the seams, the six navigation rules, the picture registry.
- `conductor/workflow.md` — `bun run verify` as the one proving command.
- `conductor/archive/20261114-minimum-vertical-slice/spec.md` — D1–D8 of the slice, whose
  narration and progress decisions this track keeps unchanged.

## Revision R2 — arrows that mean what they say (Phase 6)

The parent played lesson 1 and named the gap this spec left open: a child could not know the order.
The three arrows were abstract "first, second, third" steps on a straight lane, and nothing on
screen said where the walker was going. An instruction would have explained it — and instruction is
the one thing this product does not do. So the world had to carry the meaning instead.

### Requirements added

- **FR-9** — A step means the direction it points. `step-up` moves the walker one cell up,
  `step-right` one cell right, `step-down` one cell down — in every lesson, in every game kind. A
  tap whose direction is not the next cell of the route moves him nowhere and wobbles the card:
  the arrow is not lying, there is no road that way.
- **FR-10** — The whole route is on screen before the first tap, and its last cell carries a goal
  flag. Lesson 1's route is its own solution read as directions — up, right, down — starting and
  ending on the same row, so a child who confuses up with down ends visibly in the wrong place.
- **FR-11** — Lesson 2 plays on the same grid: its road runs three cells in its single arrow's own
  direction, and one tap still walks all three.

### Acceptance criteria added

- **AC-9** — Lesson 1 renders four cells at `(0,0) (0,-1) (1,-1) (1,0)`, exactly one marked as the
  goal, and the walker's cell follows his index along that route (covers FR-9, FR-10).
- **AC-10** — The road's cells are in the DOM before any tap, and a card whose direction is not next
  leaves the walker's cell unchanged and is marked wrong (covers FR-9, FR-10).
- **AC-11** — Lesson 2 renders four cells in one row (`row` 0, `col` 0–3) with one goal, and one tap
  walks three cells and completes exactly once (covers FR-11).

### Decisions added

- **D11 — Geometry** → a grid, not a lane. `world/path.ts` owns `Cell = { col, row }`, rows grow
  downwards as the screen does, and the three deltas are the arrows' own directions.
- **D12 — Where the route comes from** → derived from the lesson's `solution`, never stored twice,
  so the road and the answer cannot disagree. A `walker` named as a route step throws with the
  lesson's id rather than guessing a direction.
- **D13 — A wrong direction** → he does not move. The product forbids dead ends, and a reset or a
  dead end would punish a four-year-old's mistake; a wobble with the walker standing still reads as
  a wall.
- **D14 — The goal flag** → `world/Goal.tsx`, deliberately not a `PictureId`: it is scenery, never a
  card, so the picture registry still holds exactly the four things a lesson may name.
