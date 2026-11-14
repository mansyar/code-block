# Review — A road that reads as a road

**Verdict:** PASS
**Reviewed:** `41dadf5` (HEAD of `feat/20261114-road-ribbon` when this round ran)
**Round:** 2 of 2
**Independence:** cold-read — same session, different turn. Every claim below was re-derived from
`spec.md`, `plan.md`, the diff `4fd0e62..41dadf5` and the three phase records, and re-measured in the
running app in this turn.

> The review is committed after the commit it reviews, so `HEAD` is `41dadf5` plus this file and
> `metadata.json`. `git diff 41dadf5..HEAD -- src/` is empty: no source, test or config change came
> after the pin, only review state.

## Round 2 — Pass A (mechanical)

| Check | Result | Evidence |
|---|---|---|
| Commands pass on a clean run | **pass** | `bun run verify` exit 0 in this turn: **182 tests / 27 files**, Biome 86 files, 74.92 kB gzip (`.conductor/evidence/review-r2-verify.log`) |
| Evidence exists for every verified phase | **pass** | `verification/phase-1.md`, `phase-2.md`, `phase-3.md`; plan shows 3/3 verified |
| State honest | **pass** | `plan.md` 3/3 phases and 13/13 tasks; `metadata.json` 3/3, 13/13 |
| Decisions authorized | **pass** | evidence cites D1–D6; `spec.md` defines D1–D6; phase 3 takes none |
| Scope | **pass** | the only source change since round 1 is `Track.tsx` (+11) and the new `road.test.tsx` (+47) — exactly the R1-1 fix and its guard |
| Tests weakened | **pass** | no `.skip`/`.only`/`xit` added anywhere; count rose 174 → 182 across the track |
| No secrets | **pass** | none in the diff |
| Dependencies | **pass** | no lockfile or `package.json` change |
| Structure rule (200 lines) | **pass** | `Track.tsx` 168, `road.test.tsx` 47, `ribbon.test.ts` 30, `ribbon.ts` 62 |

## Round 2 — Pass B (judgment)

### Findings carried forward

| ID | Sev | Where | Status | Evidence |
|---|---|---|---|---|
| R1-1 | Medium | `src/world/Track.tsx` | **fixed** | The band declares `pointer-events: none` on the element (`Track.tsx:145`); `road.test.tsx` holds it in jsdom; on lesson 3 the same probe that returned the band `SPAN` in round 1 now returns the step's `BUTTON`, and clicking there takes the step back (2 → 0). |

No new findings. No finding regressed.

### Re-measured at this HEAD (not copied from the phase records)

Lesson 3, running app: 5 cells, 8 bands, thickness **10 px**, length **73.3 px**, connections
`[up]`, `[down,right]`, `[left,right]`, `[left,up]`, `[down]`, all four gap midpoints covered, no band
taking a tap (`getComputedStyle(...).pointerEvents === 'none'` everywhere), visible text
`← Make it move`.

### Coverage

Every FR (1–7), NFR (1–3) and AC (1–7) still resolves to a changed file, a test or a named evidence
artifact, exactly as round 1 traced it. The fix moved a declaration from a stylesheet to the element
and added a guard; it changed no geometry, so the round-1 measurements stand and were spot-checked
again above.

### What this review did **not** establish

- Continuity is proven at the midpoint of every gap, not pixel-by-pixel along each band.
- No lesson was completed, so no star, unlock or concept screen was exercised.
- Nothing was checked on a physical tablet, at other zoom levels or with system text scaling.
- The `Room`/`pointer-events` guard is a DOM assertion; that it makes the *browser* deliver the tap
  rests on the browser probe, which was done on lesson 3 only.

## Verdict

**PASS.** No Critical or High open, R1-1 fixed and held by a test plus a browser measurement, every
AC traced. Next: `conductor-implement ship`.

---

# Round 1 (for the record)

**Verdict:** FIXABLE · **Reviewed:** `b5686ef` · **Round:** 1

## Pass A — mechanical

| Check | Result |
|---|---|
| Commands pass on a clean run | **pass** — `bun run verify` exit 0, 180 tests / 26 files, 74.91 kB gzip |
| Evidence exists for every verified phase | **pass** — phase 1, phase 2 |
| State honest | **pass** — 2/2 phases, 10/10 tasks, `doc_sync: done` |
| Decisions authorized | **pass** — D1–D6 cited, D1–D6 defined |
| Scope | **pass** — union of `Touches`, plus the recorded `ribbon.test.ts` deviation |
| Tests weakened | **pass** — no skip/only/xit; 174 → 180 |
| No secrets | **pass** |
| Dependencies | **pass** |

## Pass B — judgment

All seven FRs, three NFRs and seven ACs traced; app re-measured (lessons 1, 2 and 3). One finding:

| ID | Sev | Where | Impact | Fix | Status |
|---|---|---|---|---|---|
| R1-1 | Medium | `src/world/Track.module.css` `.link` | The band is a positioned element above the cell's static content, so it was a hit target: a tap on the 10 px strip crossing a planned step hit the band instead of the step's button — a dead tap. Measured on lesson 3, cell 0: `elementFromPoint` on the band returned the band `SPAN`. | decline pointer events on the band | fixed in round 2 |

Found **fixable** rather than passed with a note: no Critical/High was open, but a dead tap in a
pre-literate game is not something to ship when the fix is one declaration in a file this track owns.
