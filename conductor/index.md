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

## Current focus

No tracks exist yet. The first track is the minimum vertical slice: one lesson the child can
complete end to end — open the app, play a game, hear the concept explained, keep a star.
