# src map

The router for this codebase. Read this before opening files. `src/structure.test.ts` enforces
the rules below: every directory that exists appears in `## Directories`, and nothing in that
section may name a directory that is gone. `## Planned` is not checked — it is the map of what
later phases add.

## Directories

- `src/styles/` — design tokens (`tokens.css`, every colour, space, radius, timing and
  `--tap-target`) and element-level base styles. To restyle the app, edit `tokens.css`.

## Planned

- `src/app/` — the screen reducer: which screen is showing and how screens follow each other.
- `src/content/` — lesson data. One file per lesson under `lessons/`, plus `lesson.ts` (the
  data contract) and `audio-manifest.ts` (generated).
- `src/games/` — one directory per game kind, plus `registry.ts` mapping a game kind to its
  component.
- `src/journey/` — the journey map screen.
- `src/lesson/` — the lesson screen: game → concept beat → star.
- `src/narration/` — the narration port and its adapters (silent, system voice, later audio files).
- `src/progress/` — progress schema, store and selectors.
- `src/ui/` — small shared components and the picture registry.

## Recipes

- **Add a lesson** — create `src/content/lessons/<number>-<slug>.ts`, add it to
  `src/content/lessons/index.ts`. Nothing else. If it needs a new picture, add it under
  `src/ui/pictures/` and register the id.
- **Add a game kind** — create `src/games/<kind>/`, then add one entry to `src/games/registry.ts`.
- **Add a screen** — extend the union in `src/app/screen.ts` and render it in `src/App.tsx`.
- **Change how the app speaks** — only `src/narration/`. The port is `port.ts`; the choice of
  adapter is `index.ts`.
- **Change what is remembered** — only `src/progress/`. `schema.ts` owns the shape, `store.ts`
  owns storage.
- **Change a colour, size or spacing** — only `src/styles/tokens.css`.

## Rules

1. No `utils.ts`, `helpers.ts`, `common.ts`, `shared.ts` or `misc.ts`.
2. No source file over 200 lines. Split it or move the data out.
3. No `index.ts` barrel except `src/content/lessons/index.ts`; import everything else by its own
   path, so an import line names exactly one file.
4. A lesson's `id` matches its filename, and every audio clip it names exists in the manifest.
5. Every `gameKind` a lesson uses resolves in `src/games/registry.ts`.
6. Every directory here is listed above.
