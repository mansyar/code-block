<!-- conductor:begin (managed by conductor-setup; edits inside this block are overwritten) -->
## Conductor

This project uses Conductor for spec-driven development. Entry point: `conductor/index.md`.

- A change touching more than one file, or adding any new behavior, starts as a track: plan it
  before writing code.
- While executing a phase, edit only the files named in that phase's `Touches`. A necessary
  change outside them is a recorded deviation.
- A phase is done only when its verification command was re-run by the primary agent and
  `conductor/tracks/<id>/verification/phase-<n>.md` exists.
- Never edit `conductor/` state files from inside phase execution; the primary owns them.
- Inside a mission: never ask a question. End the turn with `STOP: needs human — <reason>`.
- Never merge, never force-push, never weaken or delete a test to make a check pass.
<!-- conductor:end -->
