# Phase 3 — The order game

- Track: 20261114-minimum-vertical-slice
- Branch: feat/20261114-minimum-vertical-slice
- Base / Head: ebfafe3 / 962fd45
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no diagnostics |
| static | `bun run lint` | 0 | `biome check .` — 41 files, no diagnostics |
| static | `bun run build` | 0 | JS 226.92 kB / 71.13 kB gzip |
| unit | `bun run test` | 0 | 51 passed across 9 files |
| composite | `bun run verify` | 0 | typecheck → lint → build → test, run at 962fd45 |

Test growth 42 → 51. No test was removed, skipped or loosened, and the two phase-2 tests that open
lesson 1 (`LessonScreen.test.tsx`, `App.test.tsx`) still pass unmodified: the game's tray keeps the
`data-card` attribute those tests read, so they now exercise the real game instead of the shell's
fallback.

## What was built

- **Three pictures** — `src/ui/pictures/`, one SVG component per `PictureId`, each with a distinct
  silhouette (rounded slice, cheese triangle, domed top slice), no emoji and no external asset. The
  registry is a `Record<PictureId, ComponentType>`, so adding a picture id to the content contract
  without drawing it is a compile error.
- **The game** — `src/games/sequence/SequenceGame.tsx`. Cards are shown in the lesson's display
  order; a correct tap moves the card to the plate and locks it; a wrong tap sets `data-wrong` and
  advances nothing; completion fires once, guarded by a ref so a repeated tap on the last card
  cannot double-report.
- **The wobble** — `@keyframes wobble` on the tapped card, replaced by a `--colour-berry` flash
  under `prefers-reduced-motion: reduce`.
- **Wiring** — `src/games/registry.ts` maps `sequence` to the component, and lesson 1 now declares
  `gameKind: 'sequence'`, so node 1 opens a genuinely playable lesson rather than the shell's
  "still being built" fallback.

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| FR-4 | Solution order completes; a wrong tap changes nothing and wobbles that card; a placed card stays placed and cannot be placed twice | `src/games/sequence/SequenceGame.test.tsx:31`, `:47`, `:61`, `:76` | pass |
| AC-4 | As FR-4, observable through the DOM | same four tests, asserting `data-placed`, `data-wrong`, plate contents and a single `onComplete` call | pass |
| NFR-2 | Interactive targets at least 72×72 px from the token | every card is a real `<button>` (`SequenceGame.test.tsx:92`), so the base rule applies; the **built** stylesheet contains `min-width:var(--tap-target)` and `calc(var(--tap-target) * 1.25)` (`grep` over `dist/assets/*.css`, exit 0) | pass |
| NFR-7 | `prefers-reduced-motion` replaces the wobble with a colour flash | `SequenceGame.module.css` media query; `@media (prefers-reduced-motion:reduce)` present in the built stylesheet (`grep`, exit 0) | pass |

NFR-2 and NFR-7 are CSS behaviours. jsdom applies no stylesheet and Vitest stubs CSS, so they are
verified against the built stylesheet rather than in a unit test — quoted above, with the greps
that produced them. No assertion was dropped to reach green; the CSS-text assertion was never
possible in this runner and was replaced by the build-output check.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D7 | CSS keyframes only, no animation library; the wobble is a transform, replaced by a colour flash under reduced motion | spec D7 |

Mirrored in `.conductor/runs/20261114-minimum-vertical-slice/freebuff/decisions.md` (new appended
entry; the earlier queued D7 entry is untouched).

## Deviations

- `src/content/lessons/0001-order.ts` — added `gameKind: 'sequence'`. Outside `Touches` (which names
  `src/games/` and `src/ui/`), but it is the wiring that makes the lesson playable, which phase 2
  deliberately left to this phase.
- `src/MAP.md` — added `src/ui/` to `## Directories`, because rule 6 fails on any directory that
  exists but is unlisted, and this phase creates it.
- `src/structure.test.ts` — rule 5 now matches a registry key with or without quotes. The old check
  required `'sequence'` as a quoted string, but Biome strips redundant quotes from object keys
  (`sequence: SequenceGame`), so the rule would have failed on correctly registered games. The rule
  still requires an entry for every `gameKind` a lesson uses; nothing was relaxed beyond the quoting.

## Notes

- `SequenceGame` imports `GameProps` from `../registry` while the registry imports the component.
  The import is type-only and erased at build time (`verbatimModuleSyntax`), so there is no runtime
  cycle.
- Placed cards are `disabled` as well as guarded in the handler, so a tap on a placed card is inert
  whether it comes from a child, a test, or a screen reader.
- Scope: 12 files changed, well inside the 25 file / 800 line guard.
- Not done here: the concept beat and narration (phase 4). Completing the game still returns to the
  map, which is the phase-2 behaviour that phase 4 replaces.
