# Make it move — lesson three

## What

The third stop is playable, and it is the curriculum's cause-and-effect lesson: the child writes a
leg of the walk, presses **GO**, and watches the walker obey it. Twice.

- **A plan, not a tap.** The palette is two arrows; the plan is four steps. `cards` is now the
  palette and `solution` is the whole road, so a plan may repeat an arrow and be longer than the
  palette. Planning appends, tapping a planned step on the road takes it and everything after it
  back, and the plan is capped at the leg's length. Nothing moves until GO — that is what makes
  *he caused this* a thing a four-year-old can see.
- **Two flags, two causes.** The road runs `up, right, right, up`, with flags at plan positions 2
  and 4. The first press walks him to flag 1, where he **stops**: the flag waves, the screen holds
  for 400 ms, the plan is cleared and the walker is not. Then he plans the second leg from the cell
  his own plan reached and presses GO again. One press, one march, twice — instead of a single long
  run that would show cause and effect once, as one undifferentiated gulp.
- **The second leg is the first leg reversed.** Leg 1 is `up, right`; leg 2 is `right, up`. Same two
  arrows, no new sprite, but the second plan has to be read off the board he is now standing on
  rather than replayed from muscle memory. Re-tapping the first leg's arrows halts at flag 1,
  because from there the road goes right and the plan starts up.
- **A wrong plan is still honest.** It runs literally and stops where the road stops: no reset, no
  penalty, the leg stays editable, and the GO pad says so in colour (dashed palette outline, rose
  pad) rather than in words. GO with an empty plan simply does nothing.
- **Star, unlock, progress.** Completing the last leg earns lesson 3's star, keeps lessons 1 and 2's,
  and opens node 4 — under the same `code-block.progress.v1` key, no migration. The arrival is
  celebrated for the existing 900 ms and only then does the concept beat speak:
  *"You said go, and it went. Then you said go again — and it went again!"*
- **Nothing to read.** The lesson screen's entire visible text is `←` and "Make it move". GO is a
  drawn button with an accessible name and no visible label; no sprite id or instruction is printed
  anywhere (FR-11).

Under it: `world/run.ts` walks one leg a cell at a time and stops at the flag, the plan's end, or
where the road stops — cancelable, and it can never report arrival twice. `Track` learned to stand a
flag at every leg boundary, to take a plan for the second leg with holes behind it, and to wave the
flag the walker just reached.

## Why

Lessons 1 and 2 act on every tap, so the walker is always the finger's puppet and there is no moment
where the child causes something without touching it. One long planned run would show cause and
effect exactly once. Two flags split it into two matched plan-press-arrival pairs, give him a win in
the middle of the lesson, and make the second plan start from a world his first plan changed — the
shape real programs have. See [spec.md](./spec.md) and [plan.md](./plan.md).

## Verification

`bun run verify` exit 0 — typecheck, Biome (84 files, no warnings), build `238.76 kB / 74.97 kB gzip`
against NFR-3's 200 kB, **174 tests in 25 files** (was 127 at the base). No dependency was added
anywhere in the track, and no test was deleted, skipped or loosened; the one existing test that
changed was made stricter.

Played in a real browser (Playwright, dev server on `0.0.0.0:3000`) as well as in jsdom, which is
where two of the three defects in this track were found:

| Check | Result |
|---|---|
| Lesson 3's visible text | `←` and "Make it move" only |
| Road and flags | 5 cells, exactly 2 flags, walker 0 → 2 → 4 |
| Flag 1 | flag waves (`animation-name: _wave_…`), plan held, palette inert for 400 ms, then clears the plan and keeps the walker |
| Reduced motion | walker still advances 0 → 1 → 2 on time, `animation-name: none` |
| Tap targets | palette 90 × 90, GO 108 × 108, 16 px gaps, cells 123 px |

## Review

**PASS**, round 2, pinned to `e93afd8` — [review.md](./review.md). Round 1 was `FIXABLE` with one
High finding: FR-7 calls reaching flag 1 "a beat" in which "the flag waves", and the DOM showed
`animation-name: none` on both flags with the plan clearing on the arrival frame. Phase 5 fixes it
and the browser proves it; `verification/phase-5.md` has the before-and-after samples.

## Deferred, deliberately

**The road still reads as dots.** `.track` computes `--gap: 0.75rem` (12 px) and `--road: 12px` with
126 px cells, so each ribbon segment is a 12 × 12 px square in the gap. It is **pre-existing** —
lesson 1 shipped with it — and it affects lessons 1, 2 and 3 identically. Fixing it means choosing
between a thinner road with a wider gap, a ribbon that underlaps the cells, or larger cells and a
smaller gap; each changes shared geometry for lessons already shipped and none is authorised by this
track's decisions. Recorded with its measurements in [review.md](./review.md); it should be the first
decision of the next track.

## Evidence

`verification/phase-1.md` … `phase-5.md`, one per phase, each with the command output and an
acceptance mapping.
