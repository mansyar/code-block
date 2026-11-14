# Phase 2 — The track and the walker

- Track: 20261114-one-world-lesson-two
- Branch: feat/20261114-one-world-lesson-two
- Base / Head: c1b2b1c / 3aaa4f1
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors |
| static | `bun run lint` (inside `bun run verify`) | 0 | 61 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-Dq_-qEYK.js` 230.94 kB / 72.44 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 14 files, 97 tests passed |
| all | `bun run verify` | 0 | the four stages above, in order |

Two extra checks outside the unit layer, both run in this turn:

| Check | Command | Result |
|---|---|---|
| NFR-1 in the built sheet | `grep '@media (prefers-reduced-motion:reduce)' dist/assets/*.css` | `._walker_…{animation:none}` and `._cell_…[data-walker=true]{background:var(--colour-sun)}` present |
| FR-7 sweep | `grep -rnE '>[^<]*(step-\|walker)[^<]*<' src --include=*.tsx` | no matches — no sprite id is rendered as text |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-3 | One cell per correct tap (0 → 1 → 2 → 3), a wrong tap leaves the index unchanged, completion reported once | `src/games/sequence/SequenceGame.test.tsx` — "moves the walker exactly one cell for each correct tap", "wobbles a wrong card and advances nothing", "completes once…" | pass |
| AC-3 | The path is `solution.length + 1` cells | same file — "draws one cell per step plus the start" plus `cellsFor()` in `src/world/walk.ts:15` | pass |
| FR-3 | A correct tap moves the walker one cell; a placed card cannot be tapped again | `SequenceGame.tsx:44-62`, `SequenceGame.test.tsx` "keeps a placed card placed…" | pass |
| NFR-1 | The forward move is CSS; reduced motion replaces it with a colour change | built stylesheet rule quoted above | pass |
| NFR-4 | No dependency added | `git diff 6912641..HEAD -- package.json bun.lock` → 0 lines; still 2 dependencies + 11 dev | pass |

## Evidence

- `git diff 6912641..3aaa4f1` — 7 files, 179 insertions, 46 deletions, entirely inside `Touches`.
- New durable files: `src/world/Track.tsx`, `src/world/Track.module.css`, `src/world/walk.ts`.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D3 | The world's seam is `src/world/` — `Track.tsx` draws the path, `walk.ts` owns cell count and per-cell timing | spec D3 |
| D4 | A correct tap moves the walker one cell; there is no separate "go" button | spec D4 |

## Deviations

None. The diff touches only `src/world/`, `src/games/sequence/` and `src/MAP.md`.

## Notes

`bun run verify` exited 1 twice before passing, for two different causes, both recorded:

1. **Lint**, two rules on the new `Track.tsx`: `useSemanticElements` rejected `role="group"` on a
   `div` (it suggests `<fieldset>`), and `noArrayIndexKey` rejected `key={index}`. Fixed by making
   the path a labelled `<section>` and by keying each cell on its number, which is its identity —
   cells never reorder.
2. **Typecheck**: `TS17002` — the opening tag became `<section>` but the closing tag still said
   `</div>`. Fixed.

The third run is the first run after the second cause's repair, and it is the one accepted.

One design constraint worth recording: the track is a `<section>`, not a list, because
`LessonScreen.test.tsx` and `App.test.tsx` use `getAllByRole('listitem')` to mean "lesson cards".
Adding list items for the path would have forced edits outside `Touches` and made those counts
ambiguous.

No test was weakened. `SequenceGame.test.tsx` lost the `plate()` helper along with the plate it
described, and the assertions that used it were replaced by stricter ones: the walker's exact cell
index plus the exact steps drawn on the path, where before they counted list items.
