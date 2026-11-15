# If it is red

## Problem

Lesson four is the curriculum's condition stop and the only one of the six that has no content:
`curriculum` names it — `{ id: 'condition', title: 'If it is red', order: 4 }` — and lesson three's
star is what opens it, so a child who finishes lesson 3 finds a locked node with nothing behind it.
The map promises six ideas and delivers three.

The mechanic cannot be "plan a fixed road", because lessons 1 and 3 already are that. A condition is
the first idea in the curriculum whose outcome **depends on what is on the road**, and a
four-year-old can only see that if the road itself changes colour and the walk visibly obeys it.

## Users

The four-year-old who has just finished lesson 3: he can plan four arrows from two and press GO. He
cannot read, and he will not read a colour legend — the pad has to look different by its shape as
well as its hue.

## Primary flow

He opens stop 4. The road runs four arrows long, and two of its tiles are red pads, drawn as raised
diamonds rather than flat squares. He plans the four arrows he can read off the road, presses **GO**,
and the walker takes one cell per arrow — except on a red pad, where the same arrow carries him one
cell further with a second beat. He reaches the flag, the arrival is celebrated, and the narrator
says the idea: it was red, so it went again.

## Out of scope

- Lessons 1, 2, 3, 5 and 6, and their behaviour, wording, geometry or stars.
- Any new sprite or picture id: the red pad is a pad, not a picture, and reuses the existing tiles.
- An `else` branch, nesting, two conditions in one lesson, or a lesson that changes its rule mid-play.
- Branching roads, forks or a choice of routes.
- Audio rendering: the concept line ships as text with the existing system-voice fallback.
- Any dependency, and any browser test harness: `bun run verify` must keep running without Playwright.

## Functional requirements

- **FR-1** Stop 4 is playable: id `condition`, order 4, title "If it is red", palette `step-up` and
  `step-right`, a four-step plan in one leg, and no new art.
- **FR-2** A lesson may name plan positions whose step the road takes twice. The field is optional;
  absent means no step repeats and every lesson without it behaves exactly as it does today.
- **FR-3** The drawn road is the walk: for a plan of `n` steps with `k` repeated positions, the route
  holds exactly `n + 1 + k` cells, and the extra cell of a repeated step lies in that step's own
  direction.
- **FR-4** A malformed repeat rule is rejected at import time with the lesson's id: an empty list, a
  position below 1, a position past the end of the plan, a duplicate, or a descending pair.
- **FR-5** Each repeated position is shown on the road as a **red pad**: a raised diamond on the tile
  the step lands on, distinct in silhouette from a plain tile, so the state never rests on hue alone.
- **FR-6** The walk obeys the pads: one planned step on a pad moves the walker two cells in that
  arrow's direction and takes two `STEP_MS` beats; every other step takes one cell and one beat.
- **FR-7** The plan is built and edited exactly as lesson 3's: a palette card appends, a tap on a
  planned step removes it and everything after it, and the plan is capped at its own length.
- **FR-8** Completing lesson 4 earns its star, keeps the stars for lessons 1–3, unlocks node 5, and
  needs no storage migration.
- **FR-9** No lesson screen prints a sprite id or an instruction as text: lesson 4's visible text is
  `←` and "If it is red", and every rule is carried by a picture, a colour or a motion.
- **FR-10** The arrival is celebrated before the concept beat, and the concept line names the
  condition in the child's words — "red" and "again", never "if-then" or "conditional".
- **FR-11** Lessons 1, 2 and 3 keep their routes, their plans and their walks byte-for-byte: their
  routes are still `plan.length + 1` cells, with no pads and no extra beats.

## Non-functional requirements

- **NFR-1** No dependency is added by any phase.
- **NFR-2** Nothing shrinks: the cell-size formula, the 12 px gap and the 72 px tap-target floor are
  untouched, and a red pad is not an interactive element.
- **NFR-3** The bundle stays under 200 kB gzip (last measured 74.92 kB).
- **NFR-4** Reduced motion changes nothing about the walk: cells still advance on `STEP_MS`, and no
  new animation is introduced for the pad.
- **NFR-5** The structure rules hold: no file over 200 lines, no new barrel, lesson id matches its
  filename, and every `gameKind` used resolves in `src/games/registry.ts`.

## Acceptance criteria

| # | Criterion | Proves |
|---|---|---|
| AC-1 | In unit tests, stop 4 resolves through the curriculum with a registered game, a two-arrow palette and a four-step plan | FR-1 |
| AC-2 | In unit tests, a lesson with two repeated positions has a route of `plan.length + 3` cells, and each extra cell is one step further in that arrow's direction | FR-2, FR-3 |
| AC-3 | In unit tests, each malformed repeat rule throws with the lesson's id, and every shipped lesson passes `assertLesson` | FR-4 |
| AC-4 | In jsdom, lesson 4's road has exactly one `data-pad="red"` cell per repeated position, each with the pad's silhouette class, and no other lesson has any | FR-5 |
| AC-5 | With an injected step time, one step on a pad moves the walker two route indices in two beats, and a step off a pad moves one index in one beat | FR-6 |
| AC-6 | In the browser, lesson 4's red pads are visible as diamonds beside the plain tiles, and the walk visits all six route cells — `0 → 1 → 2 → 3 → 4 → 5`, with the pad's step taking two beats (`1 → 2 → 3`) | FR-5, FR-6 |
| AC-7 | In jsdom, completing lesson 4 records its star, keeps lessons 1–3's, and unlocks node 5 under the existing `code-block.progress.v1` key | FR-8 |
| AC-8 | In the browser, lesson 4's visible text is `←` and "If it is red" only, and the road adds nothing to the accessibility tree | FR-9 |
| AC-9 | In unit tests, the shipped routes of lessons 1–3 equal their latest verified lengths, with no pads | FR-11 |
| AC-10 | `bun run verify` exits 0 with the tap-target, cell-size and structure assertions passing unchanged | NFR-1, NFR-2, NFR-3, NFR-5 |

## Edge cases and failure modes

- **A pad on the last step.** Allowed: the road is longer than the plan, and the extra cell is the
  final cell. `assertLesson` permits it; the flag stands on the last route cell.
- **Two pads in a row on the same arrow.** Legal and useful: one step, two cells, then a second step,
  two more — a straight run of five cells. The route model must not merge or skip either.
- **A four-wide road with pads.** Width is counted from the route's own columns, so a doubled step
  that lengthens the road also grows the panel's grid; the cell-size formula already divides by the
  column count, and a five-column route must still clear the 72 px floor on a 26rem panel.
- **A lesson with no repeat rule.** No pads, no expansion, no extra beat — every lesson shipped
  before this one.
- **A plan that does not reach the flag.** The palette holds only the arrows the road needs and the
  plan is capped at its own length, so the failure mode is a wrong arrow, not a short plan: the walk
  halts where the road stops, as lesson 3's does, and the plan stays editable.
- **Reduced motion.** The pad is static; the setting changes nothing about it.
- **Colour-blind play.** A red pad is a raised diamond, not a red square: the silhouette carries the
  rule and the hue reinforces it.
- **Taps.** A pad is not a control, so the road gains no tap target and none is refused over it.

## Decisions

- **D1 — The condition is "red means again".** A step that lands on a red pad is taken twice; a step
  that does not is taken once. The rule lives in the road and the walk, and the child predicts it
  before pressing GO.
  *Rejected:* a branching road with two exits (the whole world draws one route, so a fork is a
  geometry rewrite, not a lesson); "if red, press GO" as a timing game (no visible state, and a
  missed window is a dead end); an `else` branch (two rules on one screen is a second decision, and
  the pad's absence already is the else).
- **D2 — The rule is data on the plan.** `GameSpec.twice?: readonly number[]`, positions counted from
  1 the way `flags` is, absent meaning none. It is validated at import time like every other content
  rule, so a malformed lesson fails the test run instead of teaching a lie.
  *Rejected:* a per-cell colour list on the route (the route is derived, so a second list could drift
  from it), and an engine constant (a lesson-specific rule must not be hard-coded in `world/`).
- **D3 — The road expands; the plan does not.** `routeFor` applies the rule, so the drawn road and
  the walk are the same list of cells and cannot disagree. The plan stays four arrows, which is why
  the child's work is the same four taps as lesson 3 while the outcome is different.
  *Rejected:* a separate route field in the lesson (two sources of truth for one road), and letting
  the walk hop off the drawn road (he would leave the line he was told to read).
- **D4 — A pad is a pad, not a picture.** No new `PictureId`; the tile that carries a repeat gains
  `data-pad="red"` and a raised diamond style in `Track.module.css`, using the existing
  `--colour-berry` token so no palette value is invented.
  *Rejected:* a fourth sprite (the palette is the child's vocabulary of *actions*, and a pad is not an
  action), and a flat red square (colour alone, which the guidelines forbid).
- **D5 — One game kind, `condition`, beside `plan`.** It reuses `Track`, `routeFor`, the palette and
  the GO pad; the only new work is mapping a plan step to its route cells and showing the pad. A new
  kind keeps `PlanGame` — which is about legs, flags and two presses — from growing a second rule.
  *Rejected:* a `twice` flag inside `PlanGame` (two mechanics in one component, and lesson 3's tests
  would start asserting lesson 4's behaviour).
- **D6 — The lesson's shape.** Palette `['step-up', 'step-right']`, plan
  `['step-right', 'step-up', 'step-right', 'step-right']`, one leg, repeated position `[2]`: the road
  runs right, up (twice, onto a red pad), right, right — six cells, four columns wide, and the child
  sees both outcomes, one plain step and one repeated step, on one screen.
  *Rejected:* a plan of six arrows (no conditional left to learn — it would be lesson 1 again), and
  two repeated positions (a second pad teaches nothing new in a 60–120 second lesson).
- **D7 — Star, unlock and storage are the shipped ones.** `completeLesson('condition')` earns the
  star and opens node 5 through `nextLesson`; the storage key and shape do not change.
  *Rejected:* any new progress field — a second star for "harder" lessons is a scoring system the
  product deliberately does not have.
- **D8 — Nothing is printed.** The concept line — "It was red, so it went again. You looked, and you
  knew!" — is said aloud after the arrival, and the screen's only text is `←` and the title; the red
  pad says "red" in colour and shape, never in words.
  *Rejected:* an arrow legend next to the palette — the guidelines' first rule is that no text
  carries meaning, and a legend is text carrying meaning.

## Open questions and assumptions

- **Does a pad repeat the step or the cell?** Assumed the **step**, because the child's control is the
  arrow: "that arrow goes again" is something he did, while "that tile is special" is something the
  world did to him.
- **Should the last step be allowed to repeat?** Assumed yes, with the flag on the final cell, because
  forbidding it would be an arbitrary rule that a later lesson would have to unlearn; no shipped
  lesson uses it.
- **How does the child know a pad repeats?** Assumed he learns it from the first walk — the road
  shape plus the pad's diamond is enough to predict the second time, and lesson 4 is the first place
  either outcome appears. If the review finds the pad unreadable without a spoken hint, adding a
  spoken *cue* (never a printed legend) is the sanctioned fix.
