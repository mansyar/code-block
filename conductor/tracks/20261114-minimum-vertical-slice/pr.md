# Minimal vertical slice — one playable lesson, end to end

## What

A four-year-old opens an installable web app, sees six stops on a journey map, taps the first one,
and plays a game that teaches order: three picture cards are shown out of order, and tapping them in
the right order builds a sandwich. Finishing the game opens the concept beat, which shows the
finished sandwich, speaks the idea through a narration port and offers a replay control. The lesson
earns exactly one star, unlocks the second stop, and both survive a reload. The build ships a web
manifest and a service worker that precaches the shell, so a second visit renders the map with no
network.

## Why

The slice proves the whole loop — map, game, concept, narration, progress, install — on one lesson
before five more are authored. It is the first track of the project, so it also settles the
structure: ports for narration and progress, lessons as data, games registered by kind, and six
structural rules enforced by tests.

- Spec: `conductor/tracks/20261114-minimum-vertical-slice/spec.md`
- Plan: `conductor/tracks/20261114-minimum-vertical-slice/plan.md`

## Evidence

- Phase reports: `conductor/tracks/20261114-minimum-vertical-slice/verification/` (phases 1–7)
- Review: `review.md` — verdict **PASS**, round 2, independence cold-read, pinned `0f1526f`
- Verification: `bun run verify` → typecheck, Biome, build, 92 tests in 14 files, exit 0
- Build: 230.52 kB JS / **72.24 kB gzip**; 10 precached entries (237.13 KiB)
- Visual: app icons at `public/icons/icon-192.png` and `icon-512.png`; the assembled app was not
  screenshotted in this environment (no browser session), so the tablet check below is the visual
  step.

## Coverage

| ID | Test | Evidence |
|---|---|---|
| FR-1, AC-1 | `src/App.test.tsx` opens on the journey map | phase-2.md |
| FR-2, AC-2 | `src/journey/JourneyMap.test.tsx` locked/open, marker shape | phase-2.md |
| FR-3, AC-3 | `src/App.test.tsx` lesson 1 shows cards in display order | phase-3.md |
| FR-4, AC-4 | `src/games/sequence/SequenceGame.test.tsx` (6 tests) | phase-3.md |
| FR-5, AC-5 | `src/lesson/LessonScreen.test.tsx` concept beat, replay, silent voice | phase-4.md |
| FR-6, AC-6 | `src/progress/store.test.ts`, `local-storage.test.ts`, `App.test.tsx` remount | phase-5.md |
| FR-7, AC-7 | `src/App.test.tsx` star on the map, back control, node 2 open | phase-5.md, phase-7.md |
| FR-8, AC-8 | `src/pwa.test.ts` manifest, icons, worker, precache | phase-6.md |
| FR-9, AC-9 | `local-storage.test.ts`, `App.test.tsx` corrupt and unknown-version blobs | phase-5.md |
| NFR-1, NFR-3, NFR-4, NFR-5, NFR-7 | see `review.md` coverage table | phases 3–6 |
| NFR-2 | cards are real `<button>`s; locked number 7.35:1; tap tokens in built CSS | phase-3.md, phase-7.md |
| NFR-6 | — | unverified here; tablet steps below |

## Debt and follow-ups

- R1-3 (Low) — NFR-1's "no network in a tap path" is grep-verified, not guarded by a test.
- R1-4 (Low) — NFR-6 (iPad Safari 16+, both orientations) is unverified in this environment.
- Lessons 2–6 have no content yet: unlocking them shows the "coming soon" screen.
- Narration clips: the manifest ships empty, so every line uses the device voice; the offline
  Chatterbox render drops clips into `public/audio/` and the precache picks them up unchanged.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D1 | The system `speechSynthesis` behind the narration port; no Chatterbox render in this track | spec D1 |
| D2 | A file clip when the audio manifest has one for the line id, otherwise the device voice | spec D2 |
| D3 | `lang: "en-US"`, `rate: 0.9`, `pitch: 1`, one utterance at a time, cancel before speaking | spec D3 |
| D4 | Key `code-block.progress.v1`, `{ version: 1, completed, current }`, stars are `completed.length` | spec D4 |
| D7 | CSS keyframes only; the wrong-tap wobble becomes a colour flash under reduced motion | spec D7 |
| D8 | Icons drawn once by `bun run icons` with node `zlib`, committed as real 192/512 PNGs | spec D8 |

## Notes

- Ship step: `gh` is unauthenticated in this sandbox, so the branch was pushed with `cloud_git`,
  this file is the PR body, and `pr_state` is `unavailable` for a human to open the PR (plan D5).
- One implementation default the plan does not fix: `registerType: 'autoUpdate'` in the PWA config,
  so an installed tablet is not pinned to a stale build without an update prompt.
- Manual check for the parent: serve the build over HTTPS, add it to the home screen, finish lesson
  1, then turn Wi-Fi off and relaunch — the map should show the star.
