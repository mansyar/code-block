# Mission — Make it move

## Goal

Ship Conductor track 20261114-lesson-three-make-it-move.

Source of truth: conductor/tracks/20261114-lesson-three-make-it-move/{spec.md,plan.md}. Branch
feat/20261114-lesson-three-make-it-move, base main @ ab08c1a.
Do not ask me anything; every decision is in the plan. Take its pre-authorized defaults (D1-D10) and
log each one in .conductor/runs/20261114-lesson-three-make-it-move/freebuff/decisions.md.

Loop, in this order:
1. For each phase in plan.md whose Status is `pending`, in order, run conductor-implement scoped to
   it. Accept only when that phase's Verification command (`bun run verify`) exited 0 in that turn
   and its verification/phase-<n>.md exists. Never re-run a `failed` or `blocked` phase.
2. When every phase is verified, run conductor-review.
3. If review finds fixable findings, run the new Review Fixes phase (the next integer), then review
   again. Stop after two rounds.
4. Push the branch with cloud_git and open the PR with
   conductor/tracks/20261114-lesson-three-make-it-move/pr.md as the body. `gh` is authenticated
   through the GH_TOKEN project secret; if it ever is not, push anyway, write pr.md with the body,
   set pr_state to "unavailable", and stop for me.

Two rules carry over from the previous tracks: no lesson screen may print a sprite id or an
instruction as text (spec FR-11), and no phase may add a dependency (spec NFR-4).

Done when: every phase in plan.md is verified, review.md verdict is PASS pinned to HEAD, and the PR
URL is in metadata.json. Then stop — I merge myself.

Stop early and tell me when: a phase is blocked after two repair attempts, a real decision is missing
from the plan, a guard trips, or push fails. If review is still BLOCKED after R2, run ship draft
first so the findings are in a draft PR, then stop.
Never merge, never force-push, never weaken or delete a test to make a check pass.

## Effort

**3** — four phases with tests, one of which changes a content contract that two shipped lessons
already obey. That is more than a two-phase patch (2) and less than a migration with integration
surfaces (4).

## Stop rules

- A phase blocked after two repair attempts → report the command, the exit code and the failing
  assertions.
- A decision the plan does not answer → stop rather than improvise; the phase contract says a missing
  decision is a phase to split, not to guess.
- `bun run verify` cannot reach exit 0 without weakening a test → stop; that is never the fix.
- Any temptation to add a package, print an instruction as text, or add a dead end → stop; all three
  are forbidden by the spec.
