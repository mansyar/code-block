# Phase 3 — The repeat game

- Track: 20261114-one-world-lesson-two
- Branch: feat/20261114-one-world-lesson-two
- Base / Head: c1b2b1c / 32c825f
- Date: 2026-11-14
- Mode: E3
- Result: verified

## Commands

| Layer | Command | Exit | Summary |
|---|---|---|---|
| static | `bun run typecheck` (inside `bun run verify`) | 0 | no type errors |
| static | `bun run lint` (inside `bun run verify`) | 0 | 64 files checked, no fixes applied |
| static | `bun run build` (inside `bun run verify`) | 0 | `dist/assets/index-D5pgethF.js` 231.76 kB / 72.67 kB gzip |
| unit | `bun run test` (inside `bun run verify`) | 0 | 15 files, 103 tests passed |
| all | `bun run verify` | 0 | the four stages above, in order |

Checks outside the unit layer, all run in this turn:

| Gate | Command | Result |
|---|---|---|
| FR-7 | assertion in `RepeatGame.test.tsx` — "prints no words at all" | `container.textContent` is `''` before the tap, during the walk and after it, and does not match `/step-\|walker\|again and again/i` |
| NFR-1 | `grep '@media (prefers-reduced-motion:reduce)' dist/assets/*.css` | 4 blocks; the new one is `._card_…{transition:none}` + `._card_…:active{transform:none}`; the walk's own rule (`.walker{animation:none}`, `.cell[data-walker=true]{background:var(--colour-sun)}`) is unchanged from phase 2 and applies here because the game renders the same `Track` |
| NFR-4 | `git diff 871cb1f -- package.json bun.lock \| wc -l` | 0 and 0; still 2 dependencies + 11 dev |

## Acceptance

| ID | Criterion | Evidence | Status |
|---|---|---|---|
| AC-4 | Exactly one card; one tap produces three walker steps and exactly one `onComplete` | `RepeatGame.test.tsx` — "shows exactly one tappable card…", "walks three cells from one tap, and completes exactly once" | pass |
| AC-4 | A second tap mid-walk adds nothing | "ignores a second tap while he is already walking", "refuses a tap once the walk is finished" | pass |
| FR-4 | The step is repeated, not just moved | `walked` steps are `Array.from({length: walked}, () => card)` — "walks three cells…" asserts the placed steps are `['step-right','step-right','step-right']` | pass |
| FR-4 | Timers cleared on unmount; no completion after leaving | "clears its timers when the lesson closes mid-walk" (real `unmount()`, then advancing all timers) | pass |

## Evidence

- `git diff 871cb1f..HEAD` — 4 files: `src/games/repeat/{RepeatGame.tsx,RepeatGame.module.css,RepeatGame.test.tsx}`, `src/games/registry.ts`, plus the one-line deviation below.
- The walk reuses `Track` and `STEP_MS` from `src/world/`, so the repeat game owns no path of its own.

## Decisions

| ID | Taken | Authority |
|---|---|---|
| D3 | The repeat game renders the shared `src/world/` track rather than its own path | spec D3 |
| D5 | Three steps, defined as `REPEAT_STEPS` in `RepeatGame.tsx`; no new lesson-data field, and the path is `REPEAT_STEPS + 1` cells | spec D5 |

## Deviations

- `src/content/lesson.ts` — `GameKind` widened from `'sequence'` to `'sequence' | 'repeat'`. The
  registry is typed `Partial<Record<GameKind, …>>`, so a `repeat` entry cannot type-check until the
  union admits it. One line, no behaviour change, and phase 4 needs it for the lesson data anyway.

## Notes

Three `bun run verify` runs, all recorded:

1. **Exit 1 — lint.** Biome's formatter wanted one assignment joined onto a single line in
   `RepeatGame.tsx`. Fixed; nothing else changed.
2. **Exit 0 — 102 tests.** Green, but the phase's own gate asks for an FR-7 *assertion* on new
   rendering, so I added the "prints no words at all" test rather than accepting a green run that
   did not prove the rule.
3. **Exit 0 — 103 tests.** This is the accepted run: it is the last one, and it covers the final
   tree including the added assertion.

Every remaining assertion from earlier phases is untouched. `src/games/repeat/` is a new
directory; `src/MAP.md` lists `src/games/` generically ("`registry.ts`, mapping a game kind to its
component"), so structure rule 6 needed no edit.
