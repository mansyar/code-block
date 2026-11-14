# If it is red

| | |
|---|---|
| ID | `20261114-lesson-four-if-it-is-red` |
| Type | feature |
| Priority | high |
| Branch | `feat/20261114-lesson-four-if-it-is-red` |
| Base | `main` @ `d8654a8` |
| Effort | 3 |
| Autonomy | ready |
| Status | new — planned, not started |

## Artifacts

- [spec.md](./spec.md) — eleven requirements, ten acceptance criteria, decisions D1–D8
- [plan.md](./plan.md) — three phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

The curriculum's condition lesson, built as **"red means again"**. The road is four arrows long and
one of its tiles is a red pad, drawn as a raised diamond rather than a flat square. The child plans
the four arrows he reads off the road and presses **GO**; every arrow carries the walker one cell,
except on the red pad, where the same arrow carries him one cell further with a second beat.

That is the first idea in this curriculum whose outcome depends on what is **on** the road rather
than only on the order of steps, and it is the only one a four-year-old can see without a word: the
pad's shape and colour are the rule, the walk is the proof, and the road is still the instruction.
The screen shows both outcomes at once — one plain step and one repeated step — so the concept is a
comparison he has already played.

It reuses everything: the same walker, the same three arrows, the same grid and the same road band
drawn through the tiles (each cell draws its own half). No sprite is added, no palette value is
invented, and no dependency is added. Completing it earns stop 4's star, keeps the three before it,
and opens node 5.

Lesson 3 needed two presses to make two causes visible; this one needs one press that behaves
differently in two places, which is the smallest honest version of *if this, then that* that a
pre-literate child can predict before he acts.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | The plan can say "twice", and the road grows | pending |
| 2 | A red pad, and a walk that obeys it | pending |
| 3 | Lesson 4, its star, and the docs | pending |

Evidence files land in `verification/phase-<n>.md` as each phase is accepted.

## Notes for the run

The rule is **data on the plan**, not a constant in the engine: `twice: [2]` means the second planned
step is taken twice. The road is derived from the plan, so the drawn road and the walk are one list
of cells and cannot disagree — that is what keeps the road readable, which is the whole interface.

The palette is two arrows and the plan is four steps, exactly as lesson 3's shape: the child's work
is the four taps he already knows, so the only new thing on the screen is the pad. A longer plan
would remove the condition and turn the lesson back into lesson 1.

`routeFor` grows the extra cells, so **every** lesson goes through the new code path; the tests for
lessons 1–3 assert their routes are still `plan.length + 1` cells with no pads, which is how
"nothing shipped changed" is proved rather than assumed.

The red pad uses `--colour-berry` from `tokens.css` and is never a tap target, so the 72 px floor and
the cell-size formula are untouched. Colour alone is forbidden by the guidelines, so the pad's
silhouette (a raised diamond) carries the rule and the hue reinforces it.

The concept line is spoken after the arrival, as in every lesson: "It was red, so it went again. You
looked, and you knew!" — the idea named in his words, never "if-then".
