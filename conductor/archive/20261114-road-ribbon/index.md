# A road that reads as a road

| | |
|---|---|
| ID | `20261114-road-ribbon` |
| Type | bug |
| Priority | medium |
| Branch | `feat/20261114-road-ribbon` |
| Base | `main` @ `d694f2f` (rebased after PR #5 merged) |
| Effort | 2 |
| Autonomy | ready |
| Status | complete — three phases verified, review PASS, PR #6 merged |

## Artifacts

- [spec.md](./spec.md) — seven requirements, seven acceptance criteria, decisions D1–D6
- [plan.md](./plan.md) — three phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`
- [review.md](./review.md) — verdict **PASS**, round 2, pinned to `41dadf5`
- [pr.md](./pr.md) — the body of PR #6

## What this track ships

A road that looks like a road. Before it, every stretch of the road was a **12 × 12 px square** sitting
in the gap between two 117–126 px tiles — `--road: 12px` inside `--gap: 0.75rem` — so lessons 1, 2 and
3 read as a line of specks. The route's shape is how a child who cannot read is told what to do, which
made it the one part of the screen that must not be fuzzy.

Each cell now draws its own connections instead: a 10 px band from its centre toward the neighbour it
joins, tucking under the pictures and meeting the next cell's band in the middle. Interior cells get
two, the start and the flag get one, and cells the route does not join stay unjoined. `ribbon()` was
replaced by `links(route, index)`, and the DOM carries `data-link="up|right|down|left"`.

Nothing else moved — same cells, same 12 px gap, same tap targets, same lesson data. The fix is
deliberately geometric: no art, no outline, no widening of the gap (which would push lesson 2's
four-wide road below the 72 px tap-target floor). The band also declines pointer events, so the road
is never a tap target and a planned step over it stays removable.

## Origin

Review round 1 of [20261114-lesson-three-make-it-move](../20261114-lesson-three-make-it-move/index.md)
recorded it as R1-2 and deferred it, with the measurements, because it changes geometry that lessons
1 and 2 had already shipped and needed a decision that track did not authorise.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | The road runs through the tiles | verified — `5536331` |
| 2 | Prove it on all three lessons | verified — `4991101` |
| 3 | Review Fixes (R1) — the road never takes a tap | verified — `bf45981` |

Each phase's evidence is in [`verification/phase-<n>.md`](./verification), and the whole track was
reviewed in [review.md](./review.md) — **PASS**, pinned to `41dadf5` (round 2). Round 1 was
**FIXABLE** with one Medium finding (R1-1, the band swallowing taps), fixed in phase 3 and held by
`src/world/road.test.tsx`.

## Delivery

[PR #6](https://github.com/mansyar/code-block/pull/6) was merged into `main` as `0183ecc`, with
`pr.md` as its body. `git diff 41dadf5 main -- src/` is empty, so the merged tree is the reviewed one.

The track was written on top of the lesson-three branch (`4fd0e62`) and rebased onto `main` after
PR #5 merged, as D5 said a human step would. The rebase replayed six commits unchanged, so the
reviewed content kept its tree but the commits got new SHAs. The phase checkpoints above are the
post-rebase ones; the evidence files were written before it and their `Head` lines name the
pre-rebase commits, with this mapping:

| Phase | Pre-rebase | Post-rebase |
|---|---|---|
| 1 | `32b7b10` | `5536331` |
| 2 | `b5686ef` | `4991101` |
| 3 | `41dadf5` | `bf45981` |
