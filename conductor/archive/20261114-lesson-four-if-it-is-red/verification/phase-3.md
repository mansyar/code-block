# Phase 3 — Lesson 4, its star, and the docs

- Track: 20261114-lesson-four-if-it-is-red
- Branch: feat/20261114-lesson-four-if-it-is-red
- Base / Head: d8654a8 / a2a5d22
- Date: 2026-11-14
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` | 0 | `tsc --noEmit`, no output |
| static | `bun run lint` | 0 | Biome, 93 files checked, no fixes applied |
| static | `bun run build` | 0 | `dist/assets/index-DePS8imX.js` 241.95 kB / **75.75 kB gzip**, css 12.38 kB / 2.67 kB |
| unit | `bun run test` | 0 | **207 tests in 30 files** (202 after phase 2) |

## Browser — lesson 4 in the running app

Chromium (Playwright) against the dev server on `0.0.0.0:3000`, profile seeded with lessons 1–3
complete so stop 4 is unlocked.

| What | Measured |
|---|---|
| Road cells | **6** (`[data-cell]`) |
| Pad tiles | **1**, at `data-cell="3"`, carrying `[data-repeat="true"]` |
| Pad silhouette | `transform: matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)` — a 45° rotated square, not a flat tile |
| Pad hit-testing | `pointer-events: none` — the pad never takes a tap |
| Cell size | **89 px** wide (4 columns), above the 72 px floor |
| Palette | `step-up`, `step-right` — two arrows, no new sprite |
| Visible text | `←If it is red` — the back mark and the title, nothing else |
| Road in the a11y tree | every `[data-link]` band is `aria-hidden="true"` |
| Walk, four arrows, one press | samples at 0 → 1 → 2 → 3 → 4 → 5 ms-timed: `0 @65ms, 1 @300, 2 @707, 3 @944, 4 @1317, 5 @1740` — five beats to six cells, the pad's step taking two |
| Arrival → concept | "It was red, so it went again. You looked, and you knew!" appears after the celebration |

Screenshots (gitignored, under `.conductor/evidence/screens/`):
`lesson-four-road.png` (the road and its pad), `lesson-four-plan.png` (four arrows planned),
`lesson-four-arrival.png` (the arrival), `lesson-four-concept.png` (the concept beat).

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-1 | Stop 4 resolves with a registered game, a two-arrow palette and a four-step plan | `src/App.lessonFour.test.tsx` plays it end to end; `src/content/lessons/0004-condition.ts`; browser palette above | pass |
| AC-6 | Red pads visible as diamonds, and the walk visits six cells with the pad's step taking two | browser table above; `App.lessonFour.test.tsx` — "draws one pad on a six-cell road, and the padded step takes two beats" | pass |
| AC-7 | Its star, the earlier three kept, node 5 unlocked, same storage key | `App.lessonFour.test.tsx` — "earns lesson 4 its star and opens lesson 5", "stores four completed lessons under the unchanged key" | pass |
| AC-8 | Visible text is the back mark and the title; the road adds nothing to the tree | `App.lessonFour.test.tsx` — "prints nothing: the screen says only where to go back and what it is called" (`text === '←If it is red'`, no `step-`/`walker`); browser `aria-hidden` check | pass |
| AC-10 | `bun run verify` exits 0 | commands table | pass |
| FR-10 | The arrival is celebrated before the concept speaks | `App.lessonFour.test.tsx` — "celebrates the arrival before the concept speaks" | pass |

## Decisions taken

- **D6** — palette `['step-up', 'step-right']`, plan `['step-right', 'step-up', 'step-right',
  'step-right']`, `twice: [2]`, one leg; the road is six cells over four columns.
- **D7** — star and unlock through the shipped `completeLesson`/`nextLesson`; no new storage field.
- **D8** — nothing printed: the concept line is spoken after the arrival, `←` and the title are the
  screen's only text.

## Evidence

- `src/content/lessons/0004-condition.ts`, `src/content/lessons/index.ts`
- `src/App.lessonFour.test.tsx`
- `src/MAP.md`, `conductor/product.md`, `conductor/product-guidelines.md`
- screenshots listed above

## Deviations

- **`src/world/path.test.ts` — outside this phase's `Touches`.** Phase 1's test asserted that *every*
  shipped lesson routes to `plan.length + 1` cells; once lesson 4 exists with a repeat, that assertion
  is wrong for it. The test now filters to lessons that name no `twice`, which is exactly the claim
  AC-9 makes, and asserts that the filtered set is non-empty. The assertion was not removed or
  loosened: it still checks every non-repeating lesson, and phase 1's four repeat tests still cover
  the expanded road.

## Notes

The browser run is the second, independent check of FR-9: the jsdom test compares the lesson
subtree's text, and the browser confirms the same string on the real screen while the pad is drawn.
The concept beat still prints its line, as it does in lessons 1–3; FR-9 is about the game screen not
instructing in words, and that is what both checks hold.
