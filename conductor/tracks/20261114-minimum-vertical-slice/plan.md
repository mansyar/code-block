# Minimum vertical slice — Implementation Plan

> **Branch:** `feat/20261114-minimum-vertical-slice`
> **Base:** `main` @ `ebfafe3`
> **Autonomy:** ready
> **Decisions:** D1, D2, D3, D4, D5, D6, D7, D8
> **Effort:** 3

Base note: `main` (`cc894c2`) does not contain the two `conductor-setup` commits, which are not
yet pushed. This branch is therefore cut from `ebfafe3`, which is `main` plus those commits, so
that `conductor/` exists on the branch. Reparenting onto `origin/main` after a push is a human
step, not a phase.

Dependencies are named without version pins: `tech-stack.md` D-TS8 installs the current stable
release of each and freezes it in `bun.lock`. If a freshly installed major rejects the code, the
phase steps back one major, records the downgrade in its evidence file as a deviation, and
continues — it never adds a package that is not named in the phase.

## Phase 1: Scaffold and the verify loop

- **Goal:** `bun run verify` runs typecheck, lint, build and tests and exits 0, with `src/MAP.md`
  and the six structural rules in place.
- **Depends on:** none
- **Covers:** FR-1, NFR-4
- **Touches:** `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `index.html`,
  `biome.json`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/styles/`, `src/MAP.md`,
  `src/structure.test.ts`, `src/vite-env.d.ts`
- **Dependencies:** `react`, `react-dom`, `@types/react`, `@types/react-dom`, `vite`,
  `@vitejs/plugin-react`, `typescript`, `@biomejs/biome`, `vitest`, `jsdom`,
  `@testing-library/react`, `@testing-library/jest-dom`
- **Decisions:** none
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 941880d
**Evidence:** conductor/tracks/20261114-minimum-vertical-slice/verification/phase-1.md

- [x] **P1.T1: `package.json` with the script surface** — covers: NFR-4
  - [x] **P1.T1.1:** scripts `dev`, `build`, `preview`, `test`, `typecheck`, `lint`, `format`,
    `verify`, `icons`; `verify` = typecheck → lint → build → test
  - [x] **P1.T1.2:** `private: true`, `type: "module"`, no publish metadata
- [x] **P1.T2: strict TypeScript configuration** — covers: NFR-4
  - [x] **P1.T2.1:** `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
    `exactOptionalPropertyTypes`, `noEmit`
- [x] **P1.T3: Vite and React entry point** — covers: FR-1
  - [x] **P1.T3.1:** `index.html` with the app title, viewport and theme colour
  - [x] **P1.T3.2:** `src/main.tsx` mounts `<App />` into `#root`
  - [x] **P1.T3.3:** `src/styles/tokens.css` defines the colour, spacing, type and `--tap-target`
    tokens, including the 72 px minimum
- [x] **P1.T4: Biome configuration** — covers: NFR-4
  - [x] **P1.T4.1:** `biome.json` with recommended rules, 2-space indent, single quotes, and
    import organisation enabled
  - [x] **P1.T4.2:** `bun run lint` fails on a deliberate violation and passes once it is reverted
- [x] **P1.T5: Vitest with jsdom and the first test** — covers: AC-1
  - [x] **P1.T5.1:** `src/App.test.tsx` renders the shell and asserts the start screen heading
- [x] **P1.T6: `src/MAP.md`** — covers: NFR-4
  - [x] **P1.T6.1:** one line per directory, plus "to add a lesson / a game / a screen, touch X"
- [x] **P1.T7: `src/structure.test.ts` with the six navigation rules** — covers: NFR-4
  - [x] **P1.T7.1:** rules 1–3 (no catch-all filenames, 200-line ceiling, no stray barrels) active
  - [x] **P1.T7.2:** rules 4–6 (lesson ids and audio, registry resolution, `MAP.md` coverage)
    written and passing vacuously while `src/content/` is still empty

## Phase 2: Content contract and the journey map

- **Goal:** the app opens on a six-node map, node 1 is activatable, nodes 2–6 are locked, and
  lesson 1's data satisfies the structural rules.
- **Depends on:** Phase 1
- **Covers:** FR-1, FR-2, FR-3, FR-9, AC-1, AC-2, AC-3, AC-9, NFR-6
- **Touches:** `src/content/`, `src/progress/schema.ts`, `src/progress/selectors.ts`, `src/app/`,
  `src/journey/`, `src/lesson/`, `src/games/registry.ts`, `src/App.tsx`
- **Dependencies:** none
- **Decisions:** D4, D6
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 7474416
**Evidence:** conductor/tracks/20261114-minimum-vertical-slice/verification/phase-2.md

- [x] **P2.T1: the `Lesson` contract** — covers: FR-3
  - [x] **P2.T1.1:** `Lesson`, `ScriptLine`, `GameSpec`, `PictureId` types in `content/lesson.ts`
  - [x] **P2.T1.2:** `assertLesson` rejecting a lesson whose solution order does not name every
    card exactly once
- [x] **P2.T2: lesson 1 and the ordered list** — covers: FR-2, FR-3
  - [x] **P2.T2.1:** `content/lessons/0001-order.ts` — sandwich, three cards, concept line,
    deterministic display order
  - [x] **P2.T2.2:** `content/lessons/index.ts` as the single ordered list
- [x] **P2.T3: audio manifest stub and clip lookup** — covers: FR-5
  - [x] **P2.T3.1:** `content/audio-manifest.ts` exporting an empty clip map and `findClip(id)`
    returning `undefined` for every id
- [x] **P2.T4: progress schema and selectors** — covers: FR-2, FR-9
  - [x] **P2.T4.1:** `progress/schema.ts` — `parseProgress` returning `Progress | null` per D4
  - [x] **P2.T4.2:** `progress/selectors.ts` — `starsFor`, `isUnlocked`, `nextLesson`
- [x] **P2.T5: the screen reducer** — covers: FR-1, D6
  - [x] **P2.T5.1:** `app/screen.ts` with `{ kind: "map" } | { kind: "lesson"; lessonId }` and
    transitions `openLesson`, `closeLesson`
- [x] **P2.T6: the journey map** — covers: FR-2, AC-2
  - [x] **P2.T6.1:** `journey/JourneyMap.tsx` rendering six nodes with number, star and lock
  - [x] **P2.T6.2:** locked nodes are `aria-disabled`, non-activatable, and use a lock silhouette
    rather than only a colour change
  - [x] **P2.T6.3:** node 1 activates the lesson screen
- [x] **P2.T7: the lesson screen shell** — covers: FR-3
  - [x] **P2.T7.1:** `lesson/LessonScreen.tsx` resolving the lesson's game kind through
    `games/registry.ts` and rendering a "not built yet" fallback while the registry is empty
  - [x] **P2.T7.2:** a back control returning to the map
- [x] **P2.T8: tests for the contract, selectors, reducer and map** — covers: AC-1, AC-2, AC-3, AC-9
  - [x] **P2.T8.1:** `parseProgress` rejects `"{"`, unknown versions and wrong types
  - [x] **P2.T8.2:** unlock logic across empty, mid and complete profiles

## Phase 3: The order game

- **Goal:** tapping bread → cheese → top slice completes the game, and every other tap wobbles the
  card and changes nothing.
- **Depends on:** Phase 2
- **Covers:** FR-4, AC-4, NFR-2, NFR-7
- **Touches:** `src/games/`, `src/ui/` (picture components only)
- **Dependencies:** none
- **Decisions:** D7
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** 962fd45
**Evidence:** conductor/tracks/20261114-minimum-vertical-slice/verification/phase-3.md

- [x] **P3.T1: the three pictures as inline SVG components** — covers: FR-3
  - [x] **P3.T1.1:** `ui/pictures/` bread, cheese and top-slice components plus a `PictureId`
    registry; no emoji, no external asset
- [x] **P3.T2: the sequence game** — covers: FR-4
  - [x] **P3.T2.1:** `games/sequence/SequenceGame.tsx` holding placed-card state and reporting
    completion through `onComplete`
  - [x] **P3.T2.2:** placed cards stay placed, are not tappable again, and are announced as placed
- [x] **P3.T3: wrong-tap feedback** — covers: NFR-7
  - [x] **P3.T3.1:** a wobble keyframe on the tapped card, replaced by a colour flash under
    `prefers-reduced-motion: reduce`
- [x] **P3.T4: register the game kind** — covers: FR-3
  - [x] **P3.T4.1:** one entry in `games/registry.ts` mapping `sequence` to the component
- [x] **P3.T5: game tests** — covers: AC-4, NFR-2
  - [x] **P3.T5.1:** solution order completes; wrong tap leaves the placed count unchanged;
    placing the same card twice is a no-op
  - [x] **P3.T5.2:** every rendered card meets the 72 px minimum from the token

## Phase 4: Narration and the concept beat

- **Goal:** completing the game shows the finished sandwich and speaks the concept line once,
  with a replay control that speaks it again.
- **Depends on:** Phase 3
- **Covers:** FR-5, AC-5, NFR-3
- **Touches:** `src/narration/`, `src/lesson/`, `src/ui/` (replay control only)
- **Dependencies:** none
- **Decisions:** D1, D2, D3
- **Verification:** `bun run verify`
- **Status:** verified
**Result:** verified
**Checkpoint:** d276c67
**Evidence:** conductor/tracks/20261114-minimum-vertical-slice/verification/phase-4.md

- [x] **P4.T1: the narration port and its silent adapter** — covers: FR-5
  - [x] **P4.T1.1:** `narration/port.ts` — `speak(line: ScriptLine): void`, `stop(): void`
  - [x] **P4.T1.2:** `narration/silence-narration.ts` recording calls for tests
- [x] **P4.T2: the system-voice adapter** — covers: FR-5, NFR-3
  - [x] **P4.T2.1:** `narration/system-narration.ts` per D3, cancelling before speaking and
    no-oping when `speechSynthesis` is absent
- [x] **P4.T3: the adapter factory** — covers: FR-5, D2
  - [x] **P4.T3.1:** `narration/index.ts` choosing a file clip when `findClip` returns one, else
    the system voice
- [x] **P4.T4: the lesson flow reaches the concept beat** — covers: FR-5
  - [x] **P4.T4.1:** `lesson/useLessonFlow.ts` with `playing` → `concept` phases, speaking on entry
- [x] **P4.T5: the concept screen** — covers: FR-5, AC-5
  - [x] **P4.T5.1:** finished picture, concept line as quiet on-screen text, and a 72 px replay
    control that re-speaks from the start
- [x] **P4.T6: narration tests** — covers: AC-5, NFR-3
  - [x] **P4.T6.1:** the port receives the concept line exactly once on completion; replay adds
    one more call; a port that throws leaves the lesson completable

## Phase 5: Progress, the star and the way back

- **Goal:** finishing lesson 1 earns one star, unlocks lesson 2, and both survive a reload.
- **Depends on:** Phase 4
- **Covers:** FR-6, FR-7, FR-9, AC-6, AC-7, AC-9, NFR-1
- **Touches:** `src/progress/`, `src/App.tsx`, `src/journey/`
- **Dependencies:** none
- **Decisions:** D4
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P5.T1: the progress store port and its in-memory adapter** — covers: FR-6
  - [ ] **P5.T1.1:** `progress/store.ts` with `load`, `completeLesson`, `starsFor`; in-memory
    adapter used by default in tests
- [ ] **P5.T2: the localStorage adapter** — covers: FR-6, FR-9
  - [ ] **P5.T2.1:** namespaced key, JSON round-trip through `parseProgress`, silent fallback to a
    fresh profile on corrupt data or a throwing `localStorage`
- [ ] **P5.T3: star and unlock on the map** — covers: FR-6, FR-7
  - [ ] **P5.T3.1:** completion writes once, however many times the win screen is entered
  - [ ] **P5.T3.2:** node 1 shows a star and node 2 becomes activatable
- [ ] **P5.T4: the back control** — covers: FR-7
  - [ ] **P5.T4.1:** returning to the map preserves the star and clears lesson-local state
- [ ] **P5.T5: integration test across a remount** — covers: AC-6, AC-7, AC-9
  - [ ] **P5.T5.1:** play → complete → unmount → remount → star and unlock present
  - [ ] **P5.T5.2:** corrupt and future-version blobs both yield a fresh profile and a rendered map

## Phase 6: Installable and offline

- **Goal:** `bun run build` produces an installable PWA whose shell and assets are precached, and
  a test that reads `dist/` proves it.
- **Depends on:** Phase 5
- **Covers:** FR-8, AC-8, NFR-5
- **Touches:** `package.json`, `vite.config.ts`, `public/`, `scripts/`, `src/pwa.test.ts`
- **Dependencies:** `vite-plugin-pwa`
- **Decisions:** D8
- **Verification:** `bun run verify`
- **Status:** pending

- [ ] **P6.T1: the icon generator** — covers: FR-8, D8
  - [ ] **P6.T1.1:** `scripts/generate-icons.ts` writing 192 and 512 PNGs with node `zlib`, wired
    to `bun run icons`
  - [ ] **P6.T1.2:** the generated PNGs committed under `public/icons/`
- [ ] **P6.T2: the manifest** — covers: FR-8
  - [ ] **P6.T2.1:** `vite-plugin-pwa` configured with name, short name, theme and background
    colours, `display: standalone`, both icons, and `orientation: any`
- [ ] **P6.T3: the precache** — covers: FR-8
  - [ ] **P6.T3.1:** the shell and built assets precached; the audio directory pattern listed so
    the later Chatterbox clips drop in without a config change
- [ ] **P6.T4: the built-output test** — covers: AC-8, NFR-5
  - [ ] **P6.T4.1:** `src/pwa.test.ts` asserting `dist/` holds a web manifest naming both icons
    and a service worker, and that precached shell entries are listed
- [ ] **P6.T5: offline behaviour confirmed in build output** — covers: FR-8
  - [ ] **P6.T5.1:** the service worker registers from the entry point and the precache manifest
    contains `index.html`
  - [ ] **P6.T5.2:** evidence records that offline behaviour was checked at the build level, and
    names the tablet check the parent may do later
