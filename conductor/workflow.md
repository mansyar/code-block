# Project Workflow

## Guiding Principles

1. The plan is the source of truth. Every phase, result, checkpoint and evidence link lives in
   `plan.md`.
2. The tech stack is deliberate. A change to it is recorded in `tech-stack.md` before the
   implementation depends on it.
3. Verification is agent-executed. The user is not asked to verify routine work.
4. Evidence over assertion. A phase is complete only when the check passed and the evidence file
   exists.
5. No silent debt. A finding is fixed, explicitly accepted, or tracked as an issue.
6. Stay inside the phase contract. A required deviation is recorded and reviewed.
7. Plan in a chat, execute in a mission, merge yourself.

## Workflow Config

```yaml
project:
  type: "web-app"
languages: ["typescript"]
commands:
  setup: "bun install"
  dev: "bun run dev"
  test: "bun run test"
  coverage: "bun run test --coverage"
  lint: "bun run lint"
  format: "bun run format"
  typecheck: "bun run typecheck"
  build: "bun run build"
  verify: "bun run verify"
coverage:
  gate: false               # no coverage tooling until the app has real modules; revisit
  scope: "new-code"
verification:
  layers: ["static", "unit"]
  budget: "targeted"        # targeted per phase; full once before the PR
  hooks: true               # run_file_change_hooks for changed files when available
  retry: 2
  manual_exceptions: []
git:
  base_branch: "main"
  fetch: true
  commit_style: "conventional"
  task_commits: true
  phase_squash: false
review:
  strict: false
  auto_fix:
    critical: true
    high: true
    medium: "in-scope"
  debt: "record"
pr:
  enabled: true
  tool: "gh"
  base: "main"
  draft_when_blocked: true
  media: "visual-only"
host:
  name: "freebuff"
  mode: "mission"
  subagents: "auto"
  evidence_screenshots: false
  evidence_commit_media: false
authorization:
  push: auto
  open_pr: auto
  merge: ask
  delete_branch: ask
  deploy: ask
```

## Verification Strategy

### The proof command

**`bun run verify`** is the one command that proves a phase. It runs, in order:

```text
bun run typecheck   → tsc --noEmit
bun run lint        → eslint .
bun run test        → vitest run
bun run build       → vite build
```

It must stay fast, hermetic and free of manual steps: no browser, no network beyond installed
dependencies, no GPU, no audio rendering, no deploy. A phase cites exactly this command in
`plan.md` and runs it before it reports a result.

The scripts do not exist until the first track creates `package.json`; from that point on, a
phase that cannot run `bun run verify` is `partial`, never `verified`.

### Layers

Only the layers this project actually runs:

- **Static** — `bun run typecheck`, `bun run lint`, `bun run build`
- **Unit** — `bun run test` (Vitest)

Deliberately absent in v1: integration, contract, E2E, smoke and visual layers. There is no
backend to integrate, no API to keep compatible, and no browser automation in the phase path.
Adding one is a stack decision recorded in `tech-stack.md`, not something a phase improvises.

### Commands

| Layer | Command | Required |
|---|---|---|
| static | `bun run typecheck` | yes |
| static | `bun run lint` | yes |
| static | `bun run build` | yes |
| unit | `bun run test` | yes |

### Pass criteria

- `bun run verify` exits `0`, re-run by the primary agent, not reported by a helper.
- Every acceptance criterion has a test or a named evidence artifact.
- No test was deleted, skipped or loosened to reach green.
- No Critical or High review finding remains open.
- The evidence file exists and names the same command.

### Evidence

`conductor/tracks/<track-id>/verification/phase-<n>.md`, in the shape defined by
`references/evidence.md`. Binaries and screenshots live under `.conductor/evidence/`, which is
gitignored.

A phase that changes visible layout may record a screenshot when a browser is available; its
absence is never a failure and never makes a phase `partial`. The tablet itself is out of the
loop by design: the parent looks when he likes.

### Retry policy

A failed check may be fixed and re-run at most **2** times. Still failing → `blocked` with the
command, the exit code and the failing assertions. Never mark a phase `verified` with a required
check skipped.

### Human-only exceptions

None. Every required check runs in the agent's shell. Notably:

- Narration audio is pre-rendered once, offline, and is **not** regenerated during verification;
  a phase asserts the clips exist and are referenced, not that they sound good.
- Deployment to Freebuff Sites is never part of a phase. It is requested by the parent.

## Quality Gates

Before a phase is accepted:

- [ ] `bun run verify` exits 0
- [ ] Behaviour changes are covered by a Vitest test
- [ ] No `any`, no non-null assertion without cause (see `code_styleguides/typescript.md`)
- [ ] The child-facing rules hold: no text-only instruction, 72 px targets, no dead end
      (see `product-guidelines.md`)
- [ ] No secrets, credentials or API keys introduced
- [ ] No test deleted, skipped or loosened
- [ ] Evidence written and linked in `plan.md`

## Commit Guidelines

```text
<type>(<scope>): <description>
```

`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Task commits carry the task ID in the
body. Acceptance adds one state commit; task commits are never squashed or reset, so every SHA a
report names stays resolvable, and the PR merge gives the final shape. Never amend across turns.

## Definition of Done

1. Every phase is `verified` with a checkpoint and evidence.
2. `bun run verify` passes on the track branch.
3. `review.md` is `PASS`, pinned to `HEAD`. No Critical or High finding is open.
4. Docs the track changed are updated.
5. The registry and `metadata.json` show the track complete and archived.
6. The branch is pushed and the PR is open. The parent merges.
