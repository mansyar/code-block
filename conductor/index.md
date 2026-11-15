# code-block — Conductor Index

<!-- conductor-version: 2 -->

A play-first coding PWA for a four-year-old. This file is the entry point for every Conductor
skill; each artifact below is authoritative for its own subject.

## Artifacts

| File | Purpose |
|---|---|
| [product.md](./product.md) | Problem, users, primary flow, scope, open questions and assumptions |
| [product-guidelines.md](./product-guidelines.md) | UX, narrator voice, accessibility and visual rules |
| [tech-stack.md](./tech-stack.md) | Languages, libraries, services, commands, recorded decisions |
| [workflow.md](./workflow.md) | Workflow Config, verification strategy, quality gates, authorization |
| [tracks.md](./tracks.md) | The track registry: one line per track, never removed |
| [code_styleguides/typescript.md](./code_styleguides/typescript.md) | TypeScript conventions |
| [code_styleguides/react.md](./code_styleguides/react.md) | React, component and PWA conventions |

## Track layout

```text
conductor/tracks/<track-id>/     spec.md plan.md metadata.json index.md mission.md
                                 verification/phase-<n>.md  review.md  pr.md
conductor/archive/<track-id>/    completed or reverted tracks
```

Run state, raw reports and evidence binaries live under `.conductor/`, which is gitignored.

## Tracks

Active and archived tracks are registered in [tracks.md](./tracks.md). One line per track, and
lines are never removed.

## Current focus

No track is in flight. The next change starts as a track in [tracks.md](./tracks.md), not as a commit.

Shipped and archived:
[20261114-lesson-four-if-it-is-red](./archive/20261114-lesson-four-if-it-is-red/index.md) — the
condition lesson: one red pad on the road, where the same arrow takes the walker one cell further.

[20261114-road-ribbon](./archive/20261114-road-ribbon/index.md) — the road the whole curriculum is
read from, drawn through the tiles instead of in the gaps between them.

[20261114-lesson-three-make-it-move](./archive/20261114-lesson-three-make-it-move/index.md) — the
cause-and-effect lesson: a plan of arrows built on the road, run in full by one press of GO.

[20261114-one-world-lesson-two](./archive/20261114-one-world-lesson-two/index.md) — one world for the
whole curriculum (a walker, arrows on a grid), lessons 1 and 2, the ribbon road and the arrival
celebration.

The slice that came before is archived:
[20261114-minimum-vertical-slice](./archive/20261114-minimum-vertical-slice/index.md).
