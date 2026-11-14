# Mission — 20261114-one-world-lesson-two

## Goal

```text
Ship Conductor track 20261114-one-world-lesson-two.

Source of truth: conductor/tracks/20261114-one-world-lesson-two/{spec.md,plan.md}. Branch feat/20261114-one-world-lesson-two, base main @ c1b2b1c.
Do not ask me anything; every decision is in the plan. Take its pre-authorized defaults (D1-D10) and log each one in .conductor/runs/20261114-one-world-lesson-two/freebuff/decisions.md.

Loop, in this order:
1. For each phase in plan.md whose Status is `pending`, in order, run conductor-implement scoped to it. Accept only when that phase's Verification command (`bun run verify`) exited 0 in that turn and its verification/phase-<n>.md exists. Never re-run a `failed` or `blocked` phase.
2. When every phase is verified, run conductor-review.
3. If review finds fixable findings, run the new Review Fixes phase (the next integer), then review again. Stop after two rounds.
4. Push the branch with cloud_git and open the PR with conductor/tracks/20261114-one-world-lesson-two/pr.md as the body. `gh` is authenticated through the GH_TOKEN project secret; if it ever is not, push anyway, write pr.md with the body, set pr_state to "unavailable", and stop for me.

Two rules this track adds to the usual gates: no lesson screen may print a sprite id or an instruction as text (spec FR-7), and no phase may add a dependency (spec NFR-4).

Done when: every phase in plan.md is verified, review.md verdict is PASS pinned to HEAD, and the PR URL is in metadata.json. Then stop - I merge myself.
Stop early and tell me when: a phase is blocked after two repair attempts, a real decision is missing from the plan, a guard trips, or push fails. If review is still BLOCKED after R2, run ship draft first so the findings are in a draft PR, then stop.
Never merge, never force-push, never weaken or delete a test to make a check pass.
```

## Effort

3 — five phases and twenty tasks, every one ending in the same four-stage `bun run verify` that
already passes today. The work is re-skinning an existing contract and copying the sequence
game's shape into a second kind; there is no migration, no new dependency and no external
service. The one real risk is Phase 1, which changes a type that eight files read at once and so
cannot be half-done.

## Done when

Every phase in `plan.md` is verified with an evidence file, `review.md` verdict is PASS pinned to
`HEAD`, and the PR URL is in `metadata.json` — or the branch is pushed, `pr.md` exists and
`pr_state` is `unavailable` with the human told.

## Stop rules

Stop and hand back when: a phase is blocked after two repair attempts, a decision is missing from
the plan, review is still BLOCKED after round 2, a guard trips (more than 25 files or 800 changed
lines, a protected path outside `Touches`, a test weakened, a lesson printing an id as text, a
new dependency), or push tooling is unavailable.

## Restart

Re-run `/mission` with the Goal text above and the same effort. State lives in `conductor/` and
`.conductor/`; nothing depends on the previous conversation.
