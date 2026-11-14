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

- [spec.md](./spec.md) — nine requirements, nine acceptance criteria, decisions D1–D8
- [plan.md](./plan.md) — three phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

The curriculum's cause-and-effect lesson. The child puts arrows on the road one tap at a time, then
presses **GO once** and the walker carries out every step he planned — two corners, four moves, one
press. A wrong plan runs until the road ends and stops there, honestly, so he edits it and presses
again.

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
| 1 | The contract learns palette vs plan | pending |
| 2 | The run engine and the plan game | pending |
| 3 | Lesson 3, its star, the unlock and the docs | pending |

Evidence files land in `verification/phase-<n>.md` as each phase is accepted.

## Notes for the run

Phase 1 is the only phase that changes a contract other lessons already obey, so it also re-asserts
every shipped lesson through the curriculum list — a later lesson cannot quietly skip the rule.

The road's flag is two columns right and two rows up from the start (D3), so the adjacency problem
the grid review found in lesson 1 cannot recur: no single arrow reaches this flag, which is why a
plan is unavoidable rather than optional.

Turns are turns of the **road**, not of the walker. A heading-based walker needs two new sprites and
a facing state; it is deliberately left for a later track and recorded as an assumption in the spec.
