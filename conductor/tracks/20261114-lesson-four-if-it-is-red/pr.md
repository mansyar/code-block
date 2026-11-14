# If it is red — lesson four

## What

Stop 4 is playable, and it is the curriculum's **condition** lesson: the road takes an arrow twice on
one red pad, so the same four taps do a different thing depending on where the walker is.

- **A plan he already knows.** Two arrows, four steps, one press of **GO** — exactly lesson 3's shape.
  What changes is the road: right, up (twice), right, right, six cells, and only the second arrow's
  tile is a pad.
- **The pad is the rule.** A repeated step moves the walker two cells in two beats instead of one. The
  child reads the road, plans the four arrows, and the walk is literal everywhere except on the pad —
  the first idea in this curriculum that depends on where he is rather than on what he tapped.
- **Drawn as a diamond.** The pad is a raised 45° square in the existing `--colour-berry` token, above
  the band and below the walker, and it declines pointer events. Colour plus shape, never colour
  alone, and never a tap target — the 72 px floor and the 12 px gap are untouched.
- **Still silent.** The lesson screen's whole text is `←` and "If it is red". The concept beat, after
  the arrival, says it in his words: *"It was red, so it went again. You looked, and you knew!"*
- **Star, unlock, progress.** Completing it earns stop 4's star, keeps 1–3's, and opens node 5 under
  the same `code-block.progress.v1` key — no migration, no new field.

Under it: `GameSpec.twice` names plan positions whose step repeats, validated at import with the
lesson's id; `routeFor` inserts the extra cell, so the drawn road and the walk stay one list and cannot
disagree; `runRoad` gives the game the world's timing when one arrow covers two cells; and a new
`condition` game kind keeps `PlanGame`'s legs and flags from growing a second rule.

## Why

The map promises six ideas and delivers three: `curriculum` has named `{ id: 'condition', title: 'If
it is red', order: 4 }` since the first track, lesson 3's star opens it, and there was nothing behind
it. Decisions D1–D8 in [spec.md](./spec.md) carry the reasoning and the rejected alternatives — a
branching road (the world draws one route), a timed "if red, press GO" (a missed window is a dead end),
a fourth sprite (the palette is a vocabulary of *actions*), and a six-arrow plan (that would remove the
condition and leave lesson 1 again).

## Verification

`bun run verify` exit 0 — typecheck, Biome (93 files, no warnings), build `241.95 kB / 75.75 kB gzip`
against NFR-3's 200 kB, **207 tests in 30 files** (182 at the base). No dependency was added, and no
test was deleted, skipped or loosened.

Measured in Chromium against the dev server, with lessons 1–3 complete so stop 4 is unlocked:

| Check | Result |
|---|---|
| Road | 6 cells, 4 columns; cells **89 px** (floor 72) |
| Pad | exactly 1, at cell 3, `transform: matrix(0.707107, …)`, `pointer-events: none` |
| Palette | `step-up`, `step-right` — two arrows, no new sprite |
| Walk, one press | `0 → 1 → 2 → 3 → 4 → 5` at ~350 ms per cell: the pad's step takes two beats, the rest one |
| Visible text | `←If it is red` |
| Road in the a11y tree | every band `aria-hidden="true"` |
| Reduced motion | pad `animation-name: none`; walk unchanged, `0 → 5` in ~1.7 s |
| Full plan | a fifth tap is refused and the card is dimmed |

## Review

**PASS**, round 1, pinned to `a2a5d22` — [review.md](./review.md). One Low finding recorded as debt:
a tap on a full palette is refused with no fresh acknowledgement. It is **pre-existing** — lesson 3
shipped the same behaviour — so fixing it here would change a shipped game this track did not
authorise; it is written up for a shared palette-control fix.

## Debt and follow-ups

- R1-1 (Low) — a tap on a full palette changes nothing; the dimmed card states the state, the tap
  itself is unacknowledged. Same in `PlanGame`.

## Evidence

`verification/phase-1.md` … `phase-3.md`, one per phase, each with the command output, the browser
measurements and the AC mapping. Screenshots of the road, the plan, the arrival and the concept are
under `.conductor/evidence/screens/` (gitignored).
