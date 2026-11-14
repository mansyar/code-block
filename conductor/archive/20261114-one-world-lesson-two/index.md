# One world, lesson two

| | |
|---|---|
| ID | `20261114-one-world-lesson-two` |
| Type | feature |
| Priority | high |
| Branch | `feat/20261114-one-world-lesson-two` |
| Base | `main` @ `c1b2b1c` |
| Effort | 3 |
| Autonomy | ready |
| Status | complete — seven phases verified, review PASS, PR open for merge |

## Artifacts

- [spec.md](./spec.md) — eight requirements, eight acceptance criteria, decisions D1–D10
- [plan.md](./plan.md) — five phases, each proved by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

One world for the whole curriculum — a walker, arrows, a path — and the second playable lesson.
Lesson 1 is rebuilt inside that world as three arrow steps in order; lesson 2 is "Do it again",
where one tap makes the walker take three steps and the child hears that one instruction can
repeat. Two stars on the map afterwards, node 3 unlocked, and lessons 3–6 have the vocabulary
they need before their mechanics are designed.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | The world's pictures, and lesson 1 rebuilt in them | verified — `7149e4f` |
| 2 | The track and the walker | verified — `3aaa4f1` |
| 3 | The repeat game | verified — `32c825f` |
| 4 | Lesson 2, its star and the unlock | verified — `8b180f0` |
| 5 | The docs catch up with the world | verified — `fb30e5f` |
| 6 | The world becomes a grid, so an arrow can be true | verified — `d7bea90` |

Each phase's evidence is in [`verification/phase-<n>.md`](./verification), and the whole track was
reviewed in [review.md](./review.md) — verdict **PASS**, pinned to `bb33099` (round 4).

## Delivery

[PR #4](https://github.com/mansyar/code-block/pull/4) is open against `main`, with `pr.md` as its
body. **The parent merges it** — this project never merges its own track.

The track was archived **before** that merge, at the parent's request, so that merging ends the
work with no follow-up commit through a second PR. That is the only thing unusual here: the code
is reviewed and pushed, not yet on `main`, and `metadata.json` records both facts — `status:
complete`, `archived_at` set, and `pr_state: open` with the PR URL.

## Notes for the run

Phase 1 cannot be split: `ui/pictures/registry.ts` is a `Record<PictureId, Component>`, so
changing the vocabulary without rewriting lesson 1 leaves the branch failing typecheck. The plan
treats that as one atomic phase rather than three red ones.

The window it replaces — bread, cheese, top slice — stays in
`conductor/archive/20261114-minimum-vertical-slice/` as the record of what shipped first.
