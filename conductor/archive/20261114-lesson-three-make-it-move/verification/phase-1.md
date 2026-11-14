# Phase 1 — The contract learns palette, plan and legs

- Track: 20261114-lesson-three-make-it-move
- Branch: feat/20261114-lesson-three-make-it-move
- Base / Head: ab08c1a / 566821e
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors across the contract and the two shipped lessons |
| static | `bun run lint` (inside `bun run verify`) | 0 | 73 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-BF51GaNc.js` 235.27 kB / 73.03 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 21 files, 143 tests passed (was 20 files, 127 tests) |
| all | `bun run verify` | 0 | the four stages above, in order |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-2 | A four-step plan over a two-card palette is accepted; a duplicate card, an empty plan and a plan step outside the palette are rejected | `src/content/lesson.test.ts` — "accepts a plan longer than the palette…", "rejects a duplicate card…", "rejects an empty plan", "rejects a plan step the palette does not hold, naming it" | pass |
| AC-3 | `[2, 4]` is accepted for a four-step plan; `[]`, `[2, 2]`, `[4, 2]`, `[2, 5]` and `[2]` each throw; a lesson without `flags` is a single leg | `src/content/lesson.test.ts` — the five `rejects …` cases plus "treats a lesson without flags as one leg" | pass |
| FR-2 | The contract separates a palette from a plan | `src/content/lesson.ts` — `GameSpec.cards` documented as the palette, `solution` as the plan that may be longer; `assertLesson` no longer compares their lengths | pass |
| FR-3 | A lesson may divide its plan into legs, and a malformed division throws | `src/content/lesson.ts` — `flags?: readonly number[]` plus `assertFlags` (strictly increasing, none past the end, last exactly at the end, non-empty) | pass |
| — | Lessons 1 and 2 behave exactly as before | "keeps lessons 1 and 2 as one leg each, planned card for card"; the 127 pre-existing tests pass unmodified | pass |
| — | Every shipped lesson passes the contract through the curriculum list | "passes every content lesson through the contract, with a stop for each curriculum entry" | pass |

## Evidence

- `git diff ab08c1a..566821e --stat` — 4 files: `src/content/lesson.ts` rewritten, `lesson.test.ts` new, one comment
  each in `0001-order.ts` and `0002-repeat.ts`.
- The 127 tests that existed before this phase were not edited: the relaxation is a no-op for two
  lessons whose plans already equal their palettes, which is what the second acceptance row proves.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D2 | `cards` is the palette; `solution` is the whole road and may be longer; a duplicate card, an empty plan and a foreign step still throw | spec D2 |
| D3 | Legs are data: `flags` holds plan positions, strictly increasing, last at the end of the plan | spec D3 |
| D4 | The contract carries the leg boundary, so the walker's position can survive a leg change instead of the game inferring where halfway is | spec D4 |

## Deviations

- `src/content/lesson.ts` — `GameKind` gained `'plan'` here rather than in P3.T4.1. The union lives
  in this file, and phase 3 may not touch it; doing it now keeps the phase boundary honest. Phase 3
  then only adds the registry entry, which is the half of P3.T4 that its `Touches` allows. Disclosed
  and trivial: one union member, no behaviour.

## Notes

Two `bun run verify` runs, for two different reasons, both recorded rather than retried blindly:

1. **Lint (exit 1).** The `past the end of the plan` error was one line over the formatter's width.
   Fixed with `bunx biome check --write` on the two files this phase touched, not the whole tree, so
   no unrelated file was reformatted.
2. The first verify never ran: `bun install` plus a cold `vite build` in one command exceeded the
   five-minute ceiling of a single shell call. Timed separately, the four stages take typecheck 0 s,
   lint 1 s, build 2 s, test 21 s — the ceiling was the cold start, not the suite.
