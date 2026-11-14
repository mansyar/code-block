# TypeScript Style Guide

## Compiler settings

- `strict: true`, plus `noUncheckedIndexedAccess`, `noImplicitOverride` and `exactOptionalPropertyTypes`.
- No `any` in committed code. `unknown` at boundaries, then narrow.
- No non-null assertion (`!`) except immediately after a checked lookup, with a comment saying why.

## Types

- Prefer `type` for unions and object shapes; `interface` only when declaration merging is wanted.
- Model app state as discriminated unions, not booleans in parallel: `{ status: 'playing' } | { status: 'done'; stars: number }`.
- `readonly` on content data (`Lesson`, `ScriptLine`): curriculum is data, not mutable state.
- Export types from the module that owns them; no global `types.ts` dumping ground.
- Brand ids (`type LessonId = string & { readonly __brand: 'LessonId' }`) only where two string
  ids could be swapped by mistake.

## Naming

- `camelCase` values, `PascalCase` types and components, `SCREAMING_SNAKE_CASE` module constants.
- Booleans read as assertions: `isLocked`, `hasAudio`, `canAdvance`.
- Files: `kebab-case.ts` for modules, `PascalCase.tsx` for components.
- A function that returns a value is a noun phrase (`loadProgress`); a handler passed to a
  component is `onX` at the boundary and `handleX` inside.

## Functions and modules

- Named exports only, except Vite entry points; default exports defeat rename and search.
- One responsibility per module. `src/progress/store.ts` knows persistence, `src/progress/schema.ts`
  knows shape, and neither knows about React.
- No module-level mutable state outside the single progress store.
- Prefer pure functions for anything the tests will pin: scoring, unlock logic, script selection.
- Early returns over nested conditionals; no `else` after a `return`.

## Errors and boundaries

- Never throw for expected states. Parse `localStorage` through a schema check that returns
  `Progress | null` and let the caller fall back to a fresh profile.
- Every `catch` either handles the case or rethrows with context; no silent swallows.
- Audio load failures degrade to silence plus a visible cue; they never block the game.

## Testing

- Vitest, files next to the code as `*.test.ts(x)`.
- Test behaviour and state transitions (unlock, star, streak rollover), not implementation
  details.
- A test that would pass with the feature deleted is not a test; assert the observable outcome.
