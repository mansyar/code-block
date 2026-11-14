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
| Status | in_progress — phases 1–4 verified |

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
| 5 | Progress, the star and the way back | pending |
| 6 | Installable and offline | pending |

Evidence files land in `verification/phase-<n>.md`. Phase 1 is recorded in
[verification/phase-1.md](./verification/phase-1.md), phase 2 in
[verification/phase-2.md](./verification/phase-2.md) and phase 3 in
[verification/phase-3.md](./verification/phase-3.md) and phase 4 in
[verification/phase-4.md](./verification/phase-4.md).
