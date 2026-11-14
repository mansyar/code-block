# Review — A road that reads as a road

**Verdict:** FIXABLE
**Reviewed:** `b5686ef` (HEAD of `feat/20261114-road-ribbon` when this review ran)
**Round:** 1
**Independence:** cold-read — same session, different turn. The trace below was re-derived from
`spec.md`, `plan.md`, the diff `4fd0e62..b5686ef` and the two phase records, and every claim about the
running app was re-measured in this turn rather than copied from them.

## Pass A — mechanical

| Check | Result | Evidence |
|---|---|---|
| Commands pass on a clean run | **pass** | `bun run verify` exit 0 in this turn: 180 tests / 26 files, Biome 85 files, 74.91 kB gzip (`.conductor/evidence/review-r1-verify.log`) |
| Evidence exists for every verified phase | **pass** | `verification/phase-1.md`, `verification/phase-2.md`; both phases are marked `verified` |
| State honest | **pass** | `plan.md` 2/2 verified with 10/10 tasks checked; `metadata.json` 2/2, 10/10, `doc_sync: done` |
| Decisions authorized | **pass** | evidence files cite D1–D6; `spec.md` defines D1–D6 |
| Scope | **pass** | changed files are the union of both phases' `Touches`, plus `src/world/ribbon.test.ts` (the recorded phase-1 deviation) and `conductor/` scaffold/state |
| Tests weakened | **pass** | no `.skip`, `.only`, `xit` or `it.todo` added; the count rose 174 → 180; the two deleted ribbon assertions were replaced by six stricter connection assertions |
| No secrets | **pass** | no key material in the diff |
| Dependencies | **pass** | no lockfile or `package.json` change |

## Pass B — judgment

### Coverage

| Requirement | Where | Result |
|---|---|---|
| FR-1 road spans centre to centre, no break | `ribbon.ts`, `Track.tsx`, measured on three lessons | traced |
| FR-2 road under the pictures | `Track.module.css` `.link` / `.step` / `.goal` z-index; hit-tested | traced, **but see R1-1** |
| FR-3 one thickness from one token | `--road: 10px`, measured 10 px on every band | traced |
| FR-4 interior cells two connections, ends one | `ribbon.test.ts`, `Track.test.tsx` | traced |
| FR-5 unjoined neighbours stay unjoined | `Track.test.tsx` (lesson 1's shortcut) | traced |
| FR-6 no size changes | cells 126 / 89 / 122.7 px, gap 12 px, tap-target tests unchanged | traced |
| FR-7 no visible text, road out of the a11y tree | browser text per lesson; `aria-hidden` on bands | traced |
| NFR-1 no dependency | diff | traced |
| NFR-2 accessibility unchanged | `aria-hidden`, no focusable element, static band | traced, **but see R1-1** |
| NFR-3 bundle under budget | 74.91 kB gzip | traced |
| AC-1..AC-7 | `verification/phase-2.md`, tests, measurements | all traced |

### Independent re-measurement

Not taken from the phase records: lesson 1 (4 cells 126 px, 6 bands 10 × 75), lesson 2 (4 cells
89 px, 6 bands 10 × 56.5), lesson 3 (5 cells 122.7 px, 8 bands 10 × 73.3, flags 2 and 4). Every gap
midpoint covered, every sprite hit-tested above its band, text `←` plus the lesson title.

### What this review did **not** establish

- Continuity was proven by testing the midpoint of every gap, not by inspecting every pixel along
  each band; a sub-pixel artefact between those samples would not have been caught (none was seen in
  the screenshots).
- No lesson was completed, so no star, unlock or concept screen was exercised.
- Nothing was tested on a physical tablet, at other zoom levels or with system text scaling.

## Findings

| ID | Sev | Where | Impact | Fix | Blocks | Status |
|---|---|---|---|---|---|---|
| R1-1 | Medium | `src/world/Track.module.css` `.link` | The band is a positioned element above the cell's static content, so it is a hit target: a tap that lands on the 10 px strip crossing a cell with a planned step hits the band instead of the step's button, and nothing happens. Measured on lesson 3, cell 0: `elementFromPoint` on the band inside the planned cell returns the band `SPAN`, not the button. A dead tap is exactly what the product guidelines forbid. | `.link { pointer-events: none }` — the road is decoration and must never take a tap. | yes | open |

Round 1 has no Critical or High open, but R1-1 is a functional bug on an interactive path, so this is
found as **fixable** rather than passed with a note: it is one declaration inside a file this track
already owns, and shipping a known dead tap zone in a pre-literate game is the wrong trade.

## Verdict

**FIXABLE** — Phase 3 (Review Fixes, R1) below fixes R1-1 and proves it in the browser.
