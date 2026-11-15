# Mission — 20261114-lesson-four-if-it-is-red

## Goal

```text
Ship Conductor track 20261114-lesson-four-if-it-is-red.

Source of truth: conductor/tracks/20261114-lesson-four-if-it-is-red/{spec.md,plan.md}. Branch
feat/20261114-lesson-four-if-it-is-red, base main @ d8654a8.
Do not ask me anything; every decision is in the plan. Take its pre-authorized defaults (D1-D8) and
log each one in .conductor/runs/20261114-lesson-four-if-it-is-red/freebuff/decisions.md.

Loop, in this order:
1. For each phase in plan.md whose Status is `pending`, in order, run conductor-implement scoped to
   it. Accept only when that phase's Verification command (`bun run verify`) exited 0 in that turn
   and its verification/phase-<n>.md exists. Never re-run a `failed` or `blocked` phase.
2. When every phase is verified, run conductor-review.
3. If review finds fixable findings, run the new Review Fixes phase (the next integer), then review
   again. Stop after two rounds.
4. Push the branch with cloud_git and open the PR with
   conductor/tracks/20261114-lesson-four-if-it-is-red/pr.md as the body. `gh` is authenticated
   through the GH_TOKEN project secret; if it ever is not, push anyway, write pr.md with the body,
   set pr_state to "unavailable", and stop for me.

Two rules carry over from the previous tracks: no lesson screen may print a sprite id or an
instruction as text (spec FR-9), and no phase may add a dependency (spec NFR-1).

Done when: every phase in plan.md is verified, review.md verdict is PASS pinned to HEAD, and the PR
URL is in metadata.json. Then stop — I merge myself.

Stop early and tell me when: a phase is blocked after two repair attempts, a real decision is missing
from the plan, a guard trips, or push fails. If review is still BLOCKED after R2, run ship draft
first so the findings are in a draft PR, then stop.
Never merge, never force-push, never weaken or delete a test to make a check pass.
```

## Effort

3 — three phases with an existing Vitest suite (182 tests), one new game kind and one content file.
No migration, no new dependency, no integration surface beyond the shared `Track`, which the
previous two tracks already exercised. The risk is not scale but precision: `routeFor` is used by
every shipped lesson, so phase 1 must prove lessons 1–3 are unchanged rather than assume it.

## Done when

Every phase in plan.md is verified with an evidence file, review.md verdict is PASS pinned to HEAD,
and the PR URL is in metadata.json.

## Stop rules

Stop and hand back when: a phase is blocked after two repair attempts, a decision is missing from the
plan, review is still BLOCKED after round 2, a guard trips (a printed instruction, an added
dependency, a weakened test), or push/PR tooling is unavailable.

## Restart

Re-run `/mission` with the Goal text above and effort 3. State lives in `conductor/` and
`.conductor/`; nothing depends on the previous conversation.
