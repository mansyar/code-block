# Phase 4 — review fixes, verified

- Track: 20261114-lesson-four-if-it-is-red
- Branch: feat/20261114-lesson-four-if-it-is-red
- Phase: 4 — Review fixes — answer the tap that cannot add
- Checkpoint: `f93d35d`
- Verification: `bun run verify` — **exit 0**

## The command

| Step | Result |
|---|---|
| `tsc` typecheck | pass |
| Biome | pass — **94 files** |
| Build | pass — `242.36 kB`, **75.89 kB gzip** (ceiling 200 kB) |
| Tests | pass — **209 tests in 30 files** (was 207; +2 for the refusal cue) |

## What R1-1 was

Review round 1 recorded one Low finding: once a plan was as long as its leg (or as the road), a tap
on the palette changed nothing at all. The card was already dimmed, so the state was readable, but
the tap itself was silent — and a silent tap is indistinguishable from a broken app to someone who
cannot read (product guidelines: "Immediate feedback, always"). It was left as debt because changing
it would have changed the shipped lesson-3 game inside a track that did not authorise it. That
authorisation is now the explicit request this phase carries out.

## What changed

`src/games/palette.ts` is new and holds the single cue both games use: `REFUSED_FLASH_MS` (400 ms)
and `useRefusedArrow()`, which remembers which arrow was refused and clears itself after one beat.
Each tap is a fresh value, so tapping the same arrow twice restarts the beat instead of leaving the
first one to expire.

`PlanGame` and `ConditionGame` now split "cannot add" out of their early returns: a tap while running
or after completion still does nothing, but a tap on a full plan calls `refuseArrow(card)` and marks
that card `data-refused="true"`. `PlanGame.module.css` and `ConditionGame.module.css` outline it in
`--colour-berry` at the existing stroke width. The outline is static — no transition, no shake — so
`prefers-reduced-motion` needs no special case, and nothing is said in words.

Nothing about planning, walking, halting, completing or persistence changed: the refused tap adds no
arrow, removes none, and does not touch the run.

## Proof in the tests

| Game | Test | Asserts |
|---|---|---|
| plan | *answers a tap on a full palette, and adds nothing to the plan* | `data-refused="true"` on the pressed card and `"false"` on its sibling, plan still `up, right`, both still true after `REFUSED_FLASH_MS` |
| condition | *answers a tap on a full palette with an outline, and adds nothing* | same, on a four-arrow plan: four planned arrows before and after the flash |

Neither test replaces an older assertion; the existing "refuses to plan past the flag" test still
holds the cap itself.

## Proof in the browser

Played with `playwright-cli` (Chromium, real taps) against the dev server on `0.0.0.0:3000`:

| Check | Lesson 3 (plan) | Lesson 4 (condition) |
|---|---|---|
| Plan before the refused tap | 2 arrows (leg's capacity) | 4 arrows (road's length) |
| Pressed card | `data-refused="true"`, `data-full="true"` | `data-refused="true"`, `data-full="true"` |
| Computed outline | `solid 3px rgb(226, 102, 138)`, offset `4px` | `solid 3px rgb(226, 102, 138)`, offset `4px` |
| The other card | `data-refused="false"`, `outline: none` | `data-refused="false"`, `outline: none` |
| Plan after the tap | 2 arrows | 4 arrows |
| After 500 ms | back to `outline: none` | back to `outline: none` |
| Walk after it | — | `0 → 5`, completion reached |

No console errors or page errors in either game.

Screenshots: `.conductor/evidence/screens/refused-plan.png` (lesson 3) and
`.conductor/evidence/screens/refused-condition.png` (lesson 4) — the pressed arrow carries a berry
ring while the plan stays as it was.

## Files changed

- `src/games/palette.ts` (new)
- `src/games/plan/PlanGame.tsx`, `src/games/plan/PlanGame.module.css`,
  `src/games/plan/PlanGame.test.tsx`
- `src/games/condition/ConditionGame.tsx`, `src/games/condition/ConditionGame.module.css`,
  `src/games/condition/ConditionGame.test.tsx`
- `conductor/product-guidelines.md`

No dependency was added (`package.json`, `bun.lock` untouched). No file exceeds the 200-line rule:
`palette.ts` 38, `PlanGame.tsx` 180, `ConditionGame.tsx` 158, `PlanGame.test.tsx` 194.

## Deviations

None. Every touched file is named in the phase's `Touches`.
