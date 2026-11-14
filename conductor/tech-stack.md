# Tech Stack

## Summary

A single-page React app built by Vite, shipped as a PWA, with no backend at runtime. Lesson
narration is pre-rendered to static audio files, so the deployed product is HTML, CSS, JS and
`.mp3` — nothing else. Progress lives on the device.

## Languages and runtime

| Concern | Choice |
|---|---|
| Language | TypeScript, `strict: true`, no `any` in committed code |
| Runtime target | Evergreen browsers: iPad Safari 16+, Android Chrome, desktop Chrome/Firefox/Safari |
| Build | Vite (latest stable) with the React plugin |
| Package manager | bun (`bun.lock`) |
| Node | not a runtime dependency; bun runs the toolchain |

## Libraries

| Concern | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript | Component model matches the lesson/game screens; no SSR needed |
| PWA | `vite-plugin-pwa` (Workbox) | Generates the manifest and precache service worker from the Vite build |
| Styling | CSS Modules + global CSS custom properties | No UI kit; the visual language is bespoke and small. Tokens live in one file |
| State | React state + one `localStorage`-backed store module | The whole app state is "which lesson, how many stars, streak". No state library |
| Audio | HTML `Audio` elements with a tiny preloader | Cached files, no Web Audio graph to maintain |
| Tests | Vitest + `@testing-library/react` + jsdom | Same transform as the app; fast enough to run every phase |
| Lint / format | Biome (`biome check`, `biome format`) | One tool for lint, format and import order; no ESLint/Prettier pair to keep in sync |

No component library, no animation library, no router dependency unless a track's plan shows
that the map and lesson screens cannot be handled by a simple state machine. Any addition is
recorded here before the implementation depends on it.

**Versions are the current stable release at install time**, resolved once and frozen by
`bun.lock`. No hand-picked older majors and no dependency-update bot: a phase installs what
`latest` gives it and records the resolved version in `bun.lock`. A major bump that changes an
API the code uses is a stack change recorded here, not something a phase improvises.

## Data

- **Persistence: `localStorage`, one versioned key** (`code-block.progress.v1`), holding
  `{ version, completedLessonIds, stars, streak: { count, lastPlayedOn }, currentLessonId }`.
- Serialised through a single store module with a schema check on read; unknown or corrupt data
  resets to a fresh profile rather than throwing.
- No database, no network calls, no cookies, no analytics.

## Architecture

The app is cut into small files with one stable seam per kind of change, so any task — human or
agent — opens the files it needs and nothing else. Files are the unit of navigation: the filename
names the thing it exports, and the import path names the file.

### Layout

```text
src/
  main.tsx                    entry: mount the app, register the service worker
  App.tsx                     shell only: current screen → journey map | lesson
  MAP.md                      router: one line per directory, "to add X, touch Y"
  app/screen.ts               discriminated union + reducer (map | lesson)
  content/
    lesson.ts                 Lesson / GameSpec types — the data contract
    lessons/0001-order.ts     one lesson per file, self-contained
    lessons/index.ts          the only ordered list of lessons
    audio-manifest.ts         generated — marked do not edit
  games/
    registry.ts               gameKind → component: the one place a game is added
    sequence/                 SequenceGame.tsx, .module.css, .test.tsx
  lesson/LessonScreen.tsx     game → beat → narration → star
  narration/                  port.ts, audio-narration.ts, silence-narration.ts
  progress/                   schema.ts, store.ts, selectors.ts
  ui/                         pictures/ — one SVG per PictureId, plus its registry
  world/                      path.ts + Track.tsx + walk.ts: the one grid every lesson is
                              played on — steps are directions, the route is the road
  styles/tokens.css           every colour, space and --tap-target
```

### Seams

| Seam | File | The only place that changes… |
|---|---|---|
| Lesson data contract | `content/lesson.ts` | what a lesson may contain |
| Game registry | `games/registry.ts` | which game kinds exist |
| Narration port | `narration/port.ts` | how the app speaks (audio files today, anything later) |
| Progress port | `progress/store.ts` | how progress is read and written |
| Screen reducer | `app/screen.ts` | which screens exist and how they follow each other |
| The world | `world/path.ts` | where a step points, the route a lesson is played along, and how long a step takes (`world/Track.tsx` draws it) |
| Design tokens | `styles/tokens.css` | every visual value |

Ports carry two adapters each: the real one and a silent or in-memory one. Tests use the dummy
adapter, so jsdom never touches audio or `localStorage`, and replacing the renderer is a swap
behind an unchanged interface.

### Dependency direction

`main.tsx → App.tsx → lesson/ → games/ → {content/, ui/, narration/, progress/, world/} → styles/`.
One way only. `content/` imports nothing but its own types; nothing imports from `app/` or
`lesson/` except `App.tsx`.

### Navigation rules

These are conventions, but they are enforced by `src/structure.test.ts`, which runs inside
`bun run test` and therefore inside `bun run verify`. Each failure names the file and the rule,
so the next turn does not have to explore.

1. No `utils`, `helpers`, `common`, `shared` or `misc` files — catch-alls hide their contents.
2. No source file over 200 lines; a read is bounded and predictable.
3. No barrel `index.ts` except `content/lessons/index.ts` and `games/registry.ts`, and `content/`
   imports only its own types.
4. A lesson's `id` matches its filename, and every audio clip id it names exists in
   `audio-manifest.ts`.
5. Every `gameKind` a lesson uses resolves in `games/registry.ts`.
6. `MAP.md` lists every directory under `src/`, and names no directory that no longer exists.

Maximum nesting is three levels below `src/`. Lesson content is TypeScript data, not JSON, so
the compiler catches a game kind that does not exist before a test has to.

### What this buys

- Adding a lesson touches one new file plus `lessons/index.ts` and the audio folder.
- Adding a game touches one new directory plus one line in `games/registry.ts`.
- Changing the look touches `styles/tokens.css` and, for a specific screen, its `.module.css`.
- A phase's `Touches` is one narrow glob, so scope stays mechanically checkable.

### Accepted costs

- More files and more import lines than a monolithic screen would need.
- Indirection at the narration and progress ports.
- No router library, so no deep link into a specific lesson; navigation is the reducer.

## Content and narration

- Lesson content is authored in TypeScript data files (`src/content/lessons/*.ts`): id, order,
  game type, picture assets, script lines, and the audio file each line maps to.
- Narration is **pre-rendered offline** and committed under `public/audio/` as `.mp3` (plus a
  generated `audio/manifest.json` listing each clip and its duration).
- The renderer is **Chatterbox** (`pip install chatterbox-tts`, MIT, Python 3.11, torch 2.6).
  Important context, recorded because it constrains the decision:
  - The upstream project was **retired as research in August 2026**: the code and weights stay
    public and MIT-licensed, but it is unmaintained and unsupported. Pin a version.
  - It is a **Python/PyTorch model**: it needs a GPU to be fast, or an NVIDIA-free CPU at roughly
    2× realtime for the small Nano variant. It cannot run inside Cloudflare Workers or the
    browser.
  - Every clip carries an inaudible watermark; keep generated audio on personal use.
  - The render step is a local, one-off developer action. It is **not** part of `bun run verify`,
    is not deployed, and adds no runtime dependency or API key.
- Voice: one narrator, fixed reference clip, `Chatterbox-Turbo` on a GPU when available,
  `Chatterbox-Nano` on CPU otherwise. Consistency matters more than model choice; re-render the
  whole curriculum when the voice changes, never a subset.

## Hosting

- **Freebuff Sites**, static assets served by a minimal Worker that falls back to `index.html`
  for app routes (SPA). The deployment manifest points at `dist/`.
- Preview environment only until the parent asks for production; publishing is an explicit,
  separate authorization, never a phase step.
- No server routes, no bindings, no secrets, no environment variables.

## Commands

```text
setup      bun install
dev        bun run dev
test       bun run test
coverage   bun run test --coverage
lint       bun run lint
format     bun run format
typecheck  bun run typecheck
build      bun run build
verify     bun run verify      # typecheck + lint + test + build — the phase-proving command
```

The first track creates `package.json` and these scripts; until it does, none of them exist and
setup deliberately did not invent a scaffold.

## Constraints

- No runtime TTS, no external API calls, no keys in the client. A phase that needs the network
  at runtime is out of scope for v1.
- No backend: if a feature needs server state, it is a new decision, not an implementation
  detail.
- Audio files are binary content: keep the v1 curriculum under 10 MB and never regenerate clips
  inside a verification step.
- Chatterbox being unmaintained means the render script must stay thin and documented; a
  replacement renderer should be a drop-in that rewrites the same files.

## Recorded Decisions

- **D-TS1 — Pre-rendered narration over runtime TTS** → lesson scripts are fixed, so render once
  and ship files: instant playback, offline, no key, no per-character cost, no GPU in the
  request path. Runtime TTS would trade all of that for nothing.
- **D-TS2 — No backend in v1** → one child, one tablet; `localStorage` covers progress. A
  database would buy sync the product does not yet need.
- **D-TS3 — Vite + React SPA over Next.js** → the app is client-only and installed like an app;
  server rendering and server routes would be unused weight.
- **D-TS4 — CSS Modules over a utility framework or UI kit** → the visual language is bespoke
  and tiny; a component library would fight the design rules rather than express them.
- **D-TS5 — Full ports for narration and progress** → each gets a port plus a real and a dummy
  adapter, so tests never touch audio or storage and the renderer stays replaceable. Accepts one
  layer of indirection in exchange for deterministic tests.
- **D-TS6 — Conventions are enforced by one structural test, six rules** → the rules live in
  `src/structure.test.ts` inside `bun run verify`; a violation names the file and the rule, which
  costs less than a codebase read. Not a linter rule, because content-level checks (missing audio,
  unregistered game kind, stale `MAP.md`) are not lint-shaped.
- **D-TS7 — Lessons are TypeScript data files** → typed, compile-checked against the game
  registry and the audio manifest, with comments allowed. JSON would need a hand-written
  validation layer that the compiler already provides.
- **D-TS8 — Latest stable dependencies** → install the current stable release of every package
  and freeze it in `bun.lock`, rather than pinning known-good older majors. Reproducibility
  comes from the lockfile, not from the manifest.
- **D-TS9 — Biome for lint and format** → one binary replaces ESLint plus `typescript-eslint`
  plus Prettier, so there is a single config file (`biome.json`) and a single `bun run lint`.
  Biome does not peer-range against TypeScript's major, which removes the upgrade friction that
  the ESLint plugin stack carries.
- **D-TS10 — One world for the whole curriculum** → every lesson is played by the same actor on the
  same grid: `PictureId` is one walker plus the three arrows it can obey, each arrow means the
  direction it points — up, right, down — and never an abstract "first/second/third", and
  `world/` owns the route and the step timing. A lesson therefore adds data and a mechanic, never
  art, which keeps the sixth lesson as cheap as the second. A lesson that needs a new sprite, or an
  arrow that lies about its direction, is a recorded decision here, not something a phase
  improvises.
