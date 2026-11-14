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
| Status | complete — five phases verified, review PASS, PR #5 merged |

## Artifacts

- [spec.md](./spec.md) — eleven requirements, ten acceptance criteria, decisions D1–D10
- [plan.md](./plan.md) — five phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`
- [review.md](./review.md) — verdict **PASS**, round 2, pinned to `e93afd8`
- [pr.md](./pr.md) — the body of PR #5

## What this track ships

The curriculum's cause-and-effect lesson, built as **two legs with two flags**. The child plans the
first part of the road, presses **GO**, and the walker marches to flag 1 and stops there. Then he
plans the second part from where the walker stands, presses GO again, and finishes at flag 2.

That gives two matched cause-and-effect pairs instead of one long run, a win in the middle of the
lesson, and a second plan that has to start from a world his first plan changed. The two legs are not
copies: the road turns up, right, right, up, so leg 1 is `up, right` and leg 2 is `right, up` — the
same two arrows, and he still has to read the board again before tapping (D10). A wrong plan runs
until the road stops and halts there, honestly, so he edits it and presses again.

The stop already existed on the map as `{ id: 'cause', title: 'Make it move', order: 3 }` and is
unlocked by finishing lesson 2, so this track gave that stop content rather than adding one. The id
stayed `cause` because structure rule 4 ties a lesson id to its filename (`0003-cause.ts`).

It also changed one thing in the data contract: a lesson's `cards` are now a **palette**, and its
`solution` is a **plan** that may be longer, because four steps cannot be built from two arrows
otherwise. That split is what every later lesson with a queue sits on.

After this track the map shows three stars and node 4 is open.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | The contract learns palette, plan and legs | verified — `566821e` |
| 2 | The road can show more than one flag | verified — `c84a19d` |
| 3 | The engine and the game, a leg at a time | verified — `eef4d84` |
| 4 | Lesson 3, its star, the unlock and the docs | verified — `a1e2144` |
| 5 | Review Fixes (R1) — a beat at the first flag | verified — `43a4614` |

Each phase's evidence is in [`verification/phase-<n>.md`](./verification), and the whole track was
reviewed in [review.md](./review.md) — **PASS**, pinned to `e93afd8` (round 2).

## Delivery

[PR #5](https://github.com/mansyar/code-block/pull/5) was merged into `main` as `d694f2f`, with
`pr.md` as its body. Nothing but state files was committed after the reviewed SHA, so the merged tree
is the reviewed one — `git diff e93afd8 4fd0e62 -- src/` is empty.

Two defects were found in this track and are worth carrying forward. R1-1 (High — reaching flag 1 was
not the beat FR-7 described) was fixed in phase 5 and re-measured in the browser. R1-2 (Medium — the
road reads as dots between tiles) was **deferred deliberately**, because fixing it changes shared
geometry for lessons already shipped; it became the next track,
[20261114-road-ribbon](../20261114-road-ribbon/index.md), and is fixed there.

## Notes for the run

Phase 1 was the only phase that changed a contract other lessons already obey, so it also re-asserted
every shipped lesson through the curriculum list — a later lesson cannot quietly skip the rule.

The flags sit at plan positions 2 and 4 (D3): the walk stops at `(1,-1)` and finishes at `(2,-2)`.
Neither is reachable from the start by a single arrow, so the adjacency problem the grid review found
in lesson 1 cannot recur, and a plan is unavoidable rather than optional.

A leg's plan is cleared when the leg ends; the walker is not. That is the difference between two
causes and one long programme (D4), and it is the single rule an implementation must not "improve".

Turns are turns of the **road**, not of the walker. A heading-based walker needs two new sprites and
a facing state; it is deliberately left for a later track and recorded as an assumption in the spec.
