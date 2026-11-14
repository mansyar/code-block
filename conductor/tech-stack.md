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
| Build | Vite 6 with the React plugin |
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
| Lint / format | ESLint (flat config, `typescript-eslint`) + Prettier | Static layer of verification |

No component library, no animation library, no router dependency unless a track's plan shows
that the map and lesson screens cannot be handled by a simple state machine. Any addition is
recorded here before the implementation depends on it.

## Data

- **Persistence: `localStorage`, one versioned key** (`code-block.progress.v1`), holding
  `{ version, completedLessonIds, stars, streak: { count, lastPlayedOn }, currentLessonId }`.
- Serialised through a single store module with a schema check on read; unknown or corrupt data
  resets to a fresh profile rather than throwing.
- No database, no network calls, no cookies, no analytics.

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
