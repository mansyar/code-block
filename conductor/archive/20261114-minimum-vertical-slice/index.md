# Minimum vertical slice

| | |
|---|---|
| ID | `20261114-minimum-vertical-slice` |
| Type | mvp |
| Priority | high |
| Branch | `feat/20261114-minimum-vertical-slice` |
| Base | `main` @ `ebfafe3` |
| Effort | 3 |
| Autonomy | ready |
| Status | in_progress — all six phases verified, awaiting review |

## Artifacts

- [spec.md](./spec.md) — nine requirements, nine acceptance criteria, decisions D1–D8
- [plan.md](./plan.md) — six phases, all verified by `bun run verify`
- [mission.md](./mission.md) — the goal to paste into `/mission`

## What this track ships

A journey map with six nodes and one playable lesson: tap bread, cheese and the top slice in
order, hear the concept spoken, keep a star that survives a reload, and install the app so it
opens offline. Every seam from `conductor/tech-stack.md` exists afterwards, so lessons 2–6 are
content files rather than engineering.

## Phases

| Phase | Name | Status |
|---|---|---|
| 1 | Scaffold and the verify loop | verified |
| 2 | Content contract and the journey map | verified |
| 3 | The order game | verified |
| 4 | Narration and the concept beat | verified |
| 5 | Progress, the star and the way back | verified |
| 6 | Installable and offline | verified |

Evidence files land in `verification/phase-<n>.md`. Phase 1 is recorded in
[verification/phase-1.md](./verification/phase-1.md), phase 2 in
[verification/phase-2.md](./verification/phase-2.md) and phase 3 in
[verification/phase-3.md](./verification/phase-3.md) and phase 4 in
[verification/phase-4.md](./verification/phase-4.md) and phase 5 in
[verification/phase-5.md](./verification/phase-5.md); phase 6 in
[verification/phase-6.md](./verification/phase-6.md).

## Delivery

The pull request is open: [https://github.com/mansyar/code-block/pull/1](https://github.com/mansyar/code-block/pull/1) — base `main`, head
`feat/20261114-minimum-vertical-slice`, review round 2 PASS pinned at `0f1526f`, `pr.md` as the
body. It is left open for a human to merge.

The sandbox initially had no way to create it: `gh` was unauthenticated, an unauthenticated
`POST /repos/mansyar/code-block/pulls` returned 401, shell git could not authenticate a push,
`cloud_git` exposes only fetch/pull/push, and the cloud browser had no GitHub session. Those
attempts are recorded in `.conductor/evidence/pr-creation-attempts.md`. A `GH_TOKEN` project secret
resolved it; `gh` picked the token up from the environment and created the PR without it ever
touching a file or the transcript.
