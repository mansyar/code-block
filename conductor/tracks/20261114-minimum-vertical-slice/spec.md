# Minimum vertical slice

## Overview

The first playable end of code-block: a journey map with six nodes, one real lesson the child can
finish with taps alone, the concept spoken aloud afterwards, and a star that survives a reload —
all of it installable and working with no network.

It is a slice, not a demo: every seam named in `conductor/tech-stack.md` exists after it, so the
remaining five lessons are content files rather than engineering.

## Problem / Motivation

Setup produced a contract and no code. Until one lesson can be played, heard and remembered,
every assumption in `product.md` — that a four-year-old can finish a lesson unaided, that speech
is enough without reading, that the map motivates — is untested theory.

The slice also has to prove the loop that every later phase depends on: `bun run verify` running
typecheck, lint, build and tests, with `src/structure.test.ts` enforcing the navigation rules
before there is enough code for drift.

## Goals and Success Metrics

- The child taps node 1, finishes the order game and earns a star without an adult's help.
- The app installs to a tablet home screen and reopens with the network off.
- Adding lesson 2 requires no change outside `src/content/` — the seam claim is real.
- Every phase's `bun run verify` runs all four stages and exits 0.

## Scope

In scope:

- `bun run verify` as a working four-stage command, `src/MAP.md`, and the six structural rules.
- A six-node journey map with node 1 unlocked and nodes 2–6 locked.
- One lesson: "make a sandwich", ordered taps across three picture cards.
- Spoken concept explanation through a narration port, using the system voice.
- One star per completed lesson, persisted locally, with lesson 2 unlocked as a result.
- Web manifest, icons, service worker, offline shell.

Out of scope:

- Content for lessons 2–6 — the nodes exist, the lessons do not.
- Real Chatterbox narration clips; the file-based adapter is a later track (`D1`, `D2`).
- Streaks, day boundaries, notifications, parent dashboard, analytics.
- Deployment. Publishing to Freebuff Sites is the parent's explicit request, not a phase.
- Any backend, account, sync or network call at runtime.

## Functional Requirements

- **FR-1** — Opening the app shows the journey map as the start screen.
- **FR-2** — The map shows six ordered lesson nodes; node 1 is unlocked, nodes 2–6 are locked,
  and locked nodes differ from unlocked ones in silhouette as well as colour and cannot be
  activated by tap or keyboard.
- **FR-3** — Activating node 1 opens lesson 1, which presents its three picture cards in a fixed
  order that is not the solution order.
- **FR-4** — Tapping the cards in the lesson's solution order completes the game; tapping any
  other card leaves progress unchanged and gives that card a wobble; a correctly tapped card
  stays visibly placed and cannot be placed twice.
- **FR-5** — On completion the lesson shows the finished picture and speaks the concept line
  through the narration port, and a replay control restarts that line from the beginning.
- **FR-6** — Completion records exactly one star for lesson 1 and unlocks lesson 2, both
  persisted so that a reload or a new app launch still shows them.
- **FR-7** — A back control returns to the map, where node 1 shows its star and node 2 is
  unlocked.
- **FR-8** — The built app ships a web manifest with name, icons, theme colour and standalone
  display, plus a service worker that precaches the app shell, so a second visit renders the map
  with no network.
- **FR-9** — Absent, unparseable or unrecognised stored progress yields a fresh profile and the
  app still starts; it never throws and never shows a blank screen.

## Non-Functional Requirements

- **NFR-1** — Every tap produces a visible response within 100 ms; no tap path performs a network
  request.
- **NFR-2** — Interactive targets are at least 72×72 CSS px with at least 16 px between them, and
  text and state-bearing shapes meet 4.5:1 and 3:1 contrast respectively.
- **NFR-3** — The concept is always available as speech; a muted or speech-less device can still
  complete the lesson visually, and no string is the only carrier of meaning.
- **NFR-4** — `bun run verify` completes within 60 seconds on a warm install.
- **NFR-5** — Built JS stays under 200 KB gzipped and the precache payload under 1 MB.
- **NFR-6** — Works in iPad Safari 16+ and current Chrome, in both landscape and portrait.
- **NFR-7** — `prefers-reduced-motion: reduce` replaces the wobble with a colour flash and removes
  all transitions over 100 ms.

## Acceptance Criteria

- **AC-1** — Rendering `<App />` with a fresh profile shows six nodes and no other screen
  (covers FR-1).
- **AC-2** — Nodes 2–6 carry a locked state that is not activatable, and their locked marker is a
  different shape from the unlocked node's (covers FR-2).
- **AC-3** — Activating node 1 renders three cards in an order that is not the solution (covers
  FR-3).
- **AC-4** — Tapping the solution order completes the game; tapping a wrong card leaves the
  placed count unchanged; tapping a placed card changes nothing (covers FR-4).
- **AC-5** — On completion the narration port receives the concept line exactly once, and
  activating replay sends it again (covers FR-5).
- **AC-6** — After completion and a remount, the store reports one star for lesson 1 and lesson 2
  as unlocked (covers FR-6).
- **AC-7** — Returning to the map shows the star on node 1 and node 2 activatable (covers FR-7).
- **AC-8** — After `bun run build`, `dist/` contains a web manifest naming both icons and a
  service worker file (covers FR-8).
- **AC-9** — A store seeded with `"{"` and a store seeded with an unknown version both produce a
  fresh profile without throwing (covers FR-9).

## Decisions

- **D1** — Voice in this track → the system `speechSynthesis` behind the narration port, not
  Chatterbox clips — because no GPU exists in the phase path, a 3 GB render cannot run inside
  `bun run verify`, and the port makes the swap a single adapter later.
- **D2** — Adapter selection → the narration factory uses a file clip when the audio manifest has
  one for the line id, otherwise the system voice — so the later Chatterbox track only adds files,
  and this track can run with an empty manifest.
- **D3** — Speech parameters → `lang: "en-US"`, `rate: 0.9`, `pitch: 1.0`, one utterance at a
  time, cancelling any in-flight speech before starting a new line.
- **D4** — Progress shape → key `code-block.progress.v1`, value
  `{ version: 1, completed: string[], current: string }`; stars are `completed.length`, there is no
  separate star counter, and lessons unlock while their id is at or before the position after the
  highest completed one.
- **D5** — Ship step → `gh` is unauthenticated in this sandbox, so the mission pushes with
  `cloud_git`, writes `pr.md` with the body it would have used, sets `pr_state: "unavailable"` and
  stops for the human instead of failing the track.
- **D6** — Navigation → a discriminated-union reducer owns map and lesson; no URL routing, no
  history entries, no router dependency. The back control is a UI button.
- **D7** — Motion → CSS keyframes only, no animation library; the wobble is a transform animation
  disabled by `prefers-reduced-motion`.
- **D8** — Icons → generated once by a committed `bun run icons` script (`scripts/generate-icons.ts`)
  using node's `zlib` to write real PNGs at 192 and 512, then committed; verification asserts the
  files exist and are listed in the manifest, never that they were regenerated.

## Edge Cases and Failure Modes

- Double-tapping a card, or tapping a card after it is placed: no state change, no duplicate star.
- Tapping quickly during the win transition: completion is idempotent.
- `speechSynthesis` missing, or the tab muted: the concept still appears visually and the lesson
  still completes (NFR-3).
- Replay pressed mid-sentence: the utterance is cancelled and restarted, not layered.
- Leaving mid-lesson via back: the lesson restarts from the beginning; no partial progress is
  persisted.
- `localStorage` unavailable (private mode) or full: the in-memory adapter serves the session and
  the app does not throw.
- Progress written by a future version: treated as corrupt, replaced with a fresh profile.
- App launched offline with a cold cache: not solvable in the browser; the manifest still renders
  a browser-default error and no crash of our own code is involved.
- Reduce-motion on: wobble becomes a colour flash; nothing relies on movement to convey state.

## Dependencies

- Tracks: none.
- External packages: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`,
  `@biomejs/biome`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`,
  `vite-plugin-pwa`. No runtime service, no credential, no GPU.

## Open Questions and Assumptions

- **Lesson 1 content** → assumed "make a sandwich": bread → cheese → top slice, because three
  steps are the smallest non-trivial order problem and the completed picture is unmistakable.
- **Concept line wording** → assumed two short sentences ("You made it! You told it the order:
  first the bread, then the cheese, then the top.") — written in `0001-order.ts`, editable without
  touching code.
- **Card order** → assumed the cards are shown shuffled away from the solution order, but
  deterministic rather than random, so tests and the child see the same layout each run.
- **Map node content** → assumed nodes show a star or lock and no lesson artwork, because art for
  the other five lessons does not exist yet.
- **Audio manifest** → assumed empty in this track with the lookup returning "no clip", which is
  exactly the `D2` branch that keeps the system voice active.
- **Stars versus streak** → assumed no streak in this track; day-boundary arithmetic is its own
  problem and its own track.

## References

- `conductor/product.md` — the product this slice belongs to.
- `conductor/product-guidelines.md` — the rules FR-2, FR-4, FR-5 and NFR-2 encode.
- `conductor/tech-stack.md` — the seams, the navigation rules and the audio strategy.
- `conductor/workflow.md` — the proof command and the quality gates.
