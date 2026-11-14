# src map

The router for this codebase. Read this before opening files. `src/structure.test.ts` enforces
the rules below: every directory that exists appears in `## Directories`, and nothing in that
section may name a directory that is gone. `## Planned` is not checked — it is the map of what
later phases add.

## Directories

- `src/app/` — the screen reducer: which screen is showing and how screens follow each other.
- `src/content/` — lesson data. `lesson.ts` is the data contract, `lessons/` holds one file per
  lesson plus the ordered list, `audio-manifest.ts` is the generated narration clip map.
- `src/games/` — `registry.ts`, mapping a game kind to its component. Generated games land in
  subdirectories here.
- `src/journey/` — the journey map screen.
- `src/lesson/` — the lesson screen shell: resolves the lesson's game, hosts it, owns the back
  control.
- `src/narration/` — the narration port (`port.ts`), its adapters (silent, system voice) and the
  factory in `index.ts` that prefers a rendered clip over the voice (plan D2).
- `src/progress/` — `schema.ts` (shape and defensive parse) and `selectors.ts` (stars, unlock).
- `src/ui/` — shared presentation: `pictures/` holds one SVG per `PictureId` and the registry that
  maps ids to components.
- `src/world/` — the one world every lesson is played in: `Track.tsx` draws the path and the
  walker, `walk.ts` owns the cell count and the per-cell timing. A new game reuses this instead of
  drawing its own path.
- `src/styles/` — design tokens (`tokens.css`, every colour, space, radius, timing and
  `--tap-target`) and element-level base styles. To restyle the app, edit `tokens.css`.

## Planned

Nothing yet — every directory named in the architecture exists.

## Recipes

- **Add a lesson** — create `src/content/lessons/<number>-<slug>.ts`, add it to
  `src/content/lessons/index.ts`, and add a `LessonCard` for it if the stop is new. Nothing else.
- **Add a game kind** — create `src/games/<kind>/`, render it on the shared `src/world/Track.tsx`
  path instead of drawing its own, then add one entry to `src/games/registry.ts`.
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
