# Mission — A road that reads as a road

## Goal

Ship Conductor track 20261114-road-ribbon.

Source of truth: conductor/tracks/20261114-road-ribbon/{spec.md,plan.md}. Branch
feat/20261114-road-ribbon, base feat/20261114-lesson-three-make-it-move @ 4fd0e62.
Do not ask me anything; every decision is in the plan. Take its pre-authorized defaults (D1-D6) and
log each one in .conductor/runs/20261114-road-ribbon/freebuff/decisions.md.

Loop, in this order:
1. For each phase in plan.md whose Status is `pending`, in order, run conductor-implement scoped to
   it. Accept only when that phase's Verification command (`bun run verify`) exited 0 in that turn
   and its verification/phase-<n>.md exists. Never re-run a `failed` or `blocked` phase.
2. When every phase is verified, run conductor-review.
3. If review finds fixable findings, run the new Review Fixes phase (the next integer), then review
   again. Stop after two rounds.
4. Push the branch with cloud_git and open the PR with
   conductor/tracks/20261114-road-ribbon/pr.md as the body. `gh` is authenticated through the
   GH_TOKEN project secret; if it ever is not, push anyway, write pr.md with the body, set pr_state to
   "unavailable", and stop for me.

Two rules carry over from the previous tracks: no lesson screen may print a sprite id or an
instruction as text (FR-7), and no phase may add a dependency (NFR-1).

The road is the lesson's instruction: its shape must be readable before any tap. This track changes
how it is drawn, not what any lesson teaches — route data, tile sizes, the gap, tap targets and all
lesson wording are fixed (FR-6).

Done when: every phase in plan.md is verified, review.md verdict is PASS pinned to HEAD, and the PR
URL is in metadata.json. Then stop — I merge myself.

Stop early and tell me when: a phase is blocked after two repair attempts, a real decision is missing
from the plan, a guard trips, or push fails. If review is still BLOCKED after R2, run ship draft
first so the findings are in a draft PR, then stop.
Never merge, never force-push, never weaken or delete a test to make a check pass.

## Effort

**2** — two phases, one shared component and its styles, with tests that already exist to extend. It
is not a 3: no data changes, no new mechanic, no contract change outside `src/world/`.
