# A road that reads as a road

| | |
|---|---|
| ID | `20261114-road-ribbon` |
| Type | bug |
| Priority | medium |
| Branch | `feat/20261114-road-ribbon` |
| Base | `feat/20261114-lesson-three-make-it-move` @ `4fd0e62` |
| Effort | 2 |
| Autonomy | ready |
| Status | new — planned, not started |

## Artifacts

- [spec.md](./spec.md) — seven requirements, seven acceptance criteria, decisions D1–D6
- [plan.md](./plan.md) — two phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

A road that looks like a road. Today every stretch of it is a **12 × 12 px square** sitting in the
gap between two 117–126 px tiles — `--road: 12px` inside `--gap: 0.75rem` — so lessons 1, 2 and 3
read as a line of specks. The route's shape is how a child who cannot read is told what to do, which
makes this the one part of the screen that must not be fuzzy.

Each cell will draw its own connections instead: a 10 px band from its centre toward the neighbour it
joins, tucking under the pictures and meeting the next cell's band in the middle. Interior cells get
two, the start and the flag get one, and cells the route does not join stay unjoined. Nothing else
moves — same cells, same 12 px gap, same tap targets, same lesson data.

The fix is deliberately geometric: no art, no outline, no widening of the gap (which would push
lesson 2's four-wide road below the 72 px tap-target floor).

## Origin

Review round 1 of [20261114-lesson-three-make-it-move](../20261114-lesson-three-make-it-move/index.md)
recorded it as R1-2 and deferred it, with the measurements, because it changes geometry that lessons
1 and 2 had already shipped and needed a decision that track did not authorise.
