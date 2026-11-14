# Phase 5 — Progress, the star and the way back

- Track: 20261114-minimum-vertical-slice
- Branch: feat/20261114-minimum-vertical-slice
- Base / Head: 6f11e4b / 0b7b84e
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no diagnostics |
| static | `bun run lint` | 0 | `biome check .` — 54 files, no diagnostics |
| static | `bun run build` | 0 | JS 230.54 kB / 72.24 kB gzip |
| unit | `bun run test` | 0 | 82 passed across 13 files |
| composite | `bun run verify` | 0 | typecheck → lint → build → test, run at 0b7b84e |

Test growth 65 → 82. No test was removed, skipped or loosened; the phase passed on its first
`bun run verify`.

## What was built

- **The store** (`src/progress/store.ts`) — `load`, `completeLesson`, `starsFor` over a storage
  port. `completed` is the source of truth (D4), so finishing lesson 1 twice still leaves one
  star; `current` advances to the next open lesson and stays put at the end of the curriculum.
  Every `load()` re-reads the storage, so the value returned is the value a reload would see
  rather than an in-memory copy that happens to match.
- **The storage adapters** (`src/progress/local-storage.ts`) — the D4 key
  `code-block.progress.v1`, JSON round-tripped through `parseProgress`, with read and write both
  guarded: a locked-down Safari, a full quota or a storage that throws yields a fresh profile and
  a working app (FR-9). `createMemoryStorage` backs the in-memory adapter used by tests and used
  as the fallback when no browser storage can be reached.
- **The wiring** (`src/App.tsx`) — the shell builds the store once, reads the profile on mount,
  and on finishing a lesson calls `completeLesson` and returns to the map together, so the star
  and the opened stop are visible immediately and after a reload. The `onComplete` from the
  concept beat is what triggers it, so the learner path runs game → concept → star → map without
  a detached handler.
- **The map** (`src/journey/JourneyMap.tsx`, unchanged) — already drew a star for a completed
  lesson and a play marker for a ready one; phase 5 is what makes real progress reach it, now
  covered by a test rather than assumed.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| FR-6 | Completion records exactly one star for lesson 1 and unlocks lesson 2, persisted | `src/progress/store.test.ts` (one star however many completions), `src/progress/local-storage.test.ts` (round trip), `src/App.test.tsx` "gives lesson 1 a star and opens lesson 2" | pass |
| FR-7 | The back control returns to the map with node 1 starred and node 2 open | `src/App.test.tsx` "reopens a finished lesson with its cards fresh" and "goes back to the map from the lesson screen" | pass |
| FR-9 | Absent, unparseable or unknown stored progress yields a fresh profile, never a throw | `src/App.test.tsx` two fresh-profile tests; `src/progress/local-storage.test.ts` unparseable, unknown version and throwing storage | pass |
| AC-6 | After completion and a remount, the store reports one star and lesson 2 unlocked | `src/App.test.tsx` "keeps the star and the open stop across a remount" — real `localStorage`, `unmount()`, second render | pass |
| AC-7 | Returning to the map shows the star and node 2 activatable | `src/journey/JourneyMap.test.tsx` "shows a star on a finished node and opens the next one" (`data-state="done"`, `data-marker="star"`, lesson 2 enabled) | pass |
| AC-9 | `"{"` and an unknown version both produce a fresh profile without throwing | the two `App` tests and the two `local-storage` tests seeded with exactly those blobs | pass |
| NFR-1 | No tap path performs a network request | the store writes to `localStorage` only; nothing in the path fetches | pass |

The remount test uses the real `localStorage` through the default `createStore()`, not a stub, so
"persisted" means persisted: the second render builds a new store that reads the saved blob.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D4 | Key `code-block.progress.v1`, `{ version: 1, completed, current }`, stars = `completed.length`, idempotent completion | spec D4 |

Logged as its own applied entry in
`.conductor/runs/20261114-minimum-vertical-slice/freebuff/decisions.md`; the phase-2 entry is
untouched. D1, D2 and D3 are not exercised here — no narration changed.

## Deviations

- `src/App.test.tsx` — the `Touches` list names `src/App.tsx`; the integration tests for AC-6,
  AC-7 and AC-9 have to render the whole app across a remount, and sitting next to the component
  is where they belong. No test outside the phase was changed.

`src/journey/JourneyMap.test.tsx` is inside the phase's `src/journey/` touch, so the added map test
is not a deviation. `JourneyMap.tsx` itself needed no change.

## Notes

- The store has no subscribe/notify: `App` is the only writer and it sets state from
  `completeLesson`'s return value, so a subscription would be a second source of truth.
- The game's placed cards and the concept beat's phase are local to `LessonScreen`, so returning
  to the map and reopening the lesson starts a fresh game; the test asserts that.
- jsdom's `localStorage` is a real `Storage` implementation, so the persistence and corruption
  paths run the same code a browser does.
- Scope: 6 files changed, inside the 25 file / 800 line guard.
- Not done here: nothing in the phase is deferred. Lesson 2–6 still have no content, so unlocking
  them leads to the "coming soon" screen, which is the expected slice boundary.
