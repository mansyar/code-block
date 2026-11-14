# Make it move

| | |
|---|---|
| ID | `20261114-lesson-three-make-it-move` |
| Type | feature |
| Priority | high |
| Branch | `feat/20261114-lesson-three-make-it-move` |
| Base | `main` @ `ab08c1a` |
| Effort | 3 |
| Autonomy | ready |
| Status | new — planned, not started |

## Artifacts

- [spec.md](./spec.md) — eleven requirements, ten acceptance criteria, decisions D1–D9
- [plan.md](./plan.md) — four phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

The curriculum's cause-and-effect lesson, built as **two legs with two flags**. The child plans the
first part of the road, presses **GO**, and the walker marches to flag 1 and stops there. Then he
plans the second part from where the walker stands, presses GO again, and finishes at flag 2.

That gives two matched cause-and-effect pairs instead of one long run, a win in the middle of the
lesson, and a second plan that has to start from a world his first plan changed. A wrong plan runs
until the road stops and halts there, honestly, so he edits it and presses again.

The stop already exists on the map as `{ id: 'cause', title: 'Make it move', order: 3 }` and is
unlocked by finishing lesson 2, so this track gives that stop content rather than adding one. The id
stays `cause` because structure rule 4 ties a lesson id to its filename (`0003-cause.ts`).

It also changes one thing in the data contract: a lesson's `cards` are now a **palette**, and its
`solution` is a **plan** that may be longer, because four steps cannot be built from two arrows
otherwise. That split is what every later lesson with a queue will sit on.

After this track the map shows three stars and node 4 is open.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | The contract learns palette, plan and legs | pending |
| 2 | The road can show more than one flag | pending |
| 3 | The engine and the game, a leg at a time | pending |
| 4 | Lesson 3, its star, the unlock and the docs | pending |

Evidence files land in `verification/phase-<n>.md` as each phase is accepted.

## Notes for the run

Phase 1 is the only phase that changes a contract other lessons already obey, so it also re-asserts
every shipped lesson through the curriculum list — a later lesson cannot quietly skip the rule.

The flags sit at plan positions 2 and 4 (D3): the walk stops at `(1,-1)` and finishes at `(2,-2)`.
Neither is reachable from the start by a single arrow, so the adjacency problem the grid review found
in lesson 1 cannot recur, and a plan is unavoidable rather than optional.

A leg's plan is cleared when the leg ends; the walker is not. That is the difference between two
causes and one long programme (D4), and it is the single rule an implementation must not "improve".

Turns are turns of the **road**, not of the walker. A heading-based walker needs two new sprites and
a facing state; it is deliberately left for a later track and recorded as an assumption in the spec.
