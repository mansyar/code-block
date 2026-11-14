# If it is red — lesson four, planned

## What

This PR is the **scaffold for a new track**, not the lesson's implementation. It adds
`conductor/tracks/20261114-lesson-four-if-it-is-red/` (spec, plan, index, mission, metadata), one
registry line in `conductor/tracks.md`, and the current-focus link in `conductor/index.md`. No
application code, no test change, no dependency.

Lesson four is the only curriculum stop with nothing behind it: `curriculum` names
`{ id: 'condition', title: 'If it is red', order: 4 }`, lesson three's star is what opens it, and the
map therefore promises six ideas while delivering three.

## What the track plans to ship

The condition, taught as **"red means again"**. The road is four arrows long and one of its tiles is
a red pad; every arrow carries the walker one cell, except on the pad, where the same arrow carries
him one cell further with a second beat. The child plans the four arrows he already knows from lesson
3 and presses GO once — the outcome depends on *where he is*, not on what he tapped, which is the
first idea in this curriculum that is not about step order.

The rule is **data on the plan** (`twice: [2]`, positions counted from 1 like `flags`), and `routeFor`
grows the extra cell, so the drawn road and the walk are one list of cells. The pad is a raised
diamond in the existing `--colour-berry` token — colour plus shape, never colour alone, never a tap
target — and a new `condition` game kind keeps `PlanGame`'s legs-and-flags logic from growing a second
rule. Nothing is printed: the screen's text stays `←` and "If it is red".

Three phases, 14 tasks, autonomy `ready`, every phase verifying with `bun run verify`:

| Phase | Name | Touches |
|---|---|---|
| 1 | The plan can say "twice", and the road grows | `content/lesson.ts`, `world/path.ts` + tests |
| 2 | A red pad, and a walk that obeys it | `world/Track`, `world/run.ts`, new `games/condition/` |
| 3 | Lesson 4, its star, and the docs | `content/lessons/0004-condition.ts`, app test, docs |

## Why

Decisions D1–D8 in [spec.md](./spec.md) carry the reasoning and the rejected alternatives: a
branching road (the world draws one route, so a fork is a geometry rewrite), "if red, press GO"
(no visible state, and a missed window is a dead end), a fourth sprite (the palette is the child's
vocabulary of actions, and a pad is not an action), and a longer plan (six arrows would remove the
condition and leave lesson 1 again).

## Verification

Nothing to run as an app: the diff against `main` is `conductor/` only — five track artifacts, the
registry line and the focus link — with no `package.json` or lockfile change (spec NFR-4) and no
`src/` file touched. What was checked, by parsing the artifacts the way the mission runner does:

| Check | Result |
|---|---|
| Phases | 3, numbered 1–3, ascending with no gaps |
| Status | every phase `pending` |
| Verification | every phase exactly `bun run verify` |
| Tasks | 14 in the plan, task IDs contiguous per phase, `metadata.progress` matches |
| Autonomy / base | `ready`; `base_sha d8654a8` equals `main` and is an ancestor of HEAD |
| Registry and focus links | both resolve to this track's `index.md` |
| Diff scope | `conductor/` only, no dependency, no app code |

The implementation itself is proved phase by phase once the mission runs; `review.md` appears with
the first review round, which is why this PR carries no verdict yet.

## Evidence

- [spec.md](./spec.md) — eleven requirements, ten acceptance criteria, D1–D8
- [plan.md](./plan.md) — three phases, 14 tasks, acceptance map
- [mission.md](./mission.md) — the goal to paste into `/mission`, effort 3
