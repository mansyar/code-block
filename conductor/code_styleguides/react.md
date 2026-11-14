# React and PWA Style Guide

## Components

- Function components only. No class components, no `React.FC`; type props explicitly.
- One component per file, named after the file. Co-locate its CSS Module as `Component.module.css`.
- Props are read-only and narrow. Pass what the child-facing screen needs, not the whole store.
- Keep components presentational where possible: games receive `lesson`, `onComplete` and
  nothing else. Scoring, unlocking and persistence live in plain modules.
- No `useEffect` that could be an event handler. An effect that syncs state is a bug in the
  data flow.
- Effects that subscribe (audio ended, visibility change) must return a cleanup that removes
  every listener.

## State

- The smallest state that can be wrong. Derived values are computed during render, not stored.
- Exactly one owner for the lesson phase: the lesson screen holds it; the map reads the result
  after completion.
- No context provider until two unrelated trees need the same value; one child, one tree.

## Styling

- CSS Modules for structure, CSS custom properties for tokens (`--space-3`, `--tap-target`,
  `--ink`, `--accent`).
- No inline style objects except for values that are genuinely computed per render (a card's
  position in a drag).
- Never style by tag or by deep descendant selector across modules.
- Touch targets come from the `--tap-target` token, so the 72 px minimum is enforced in one
  place.

## Audio

- One small `useNarration` hook owns playback: preload the clip for the current screen, play on
  demand, expose `isPlaying`, cancel on unmount.
- Never autoplay more than one clip; starting a line stops the previous one.
- Every play call is idempotent and safe to call twice — a four-year-old will tap twice.

## Accessibility in components

- Interactive elements are `<button>` (or have `role="button"`, `tabIndex={0}` and key handlers).
  A `<div onClick>` is not a control.
- Every control has an accessible name; pictures that carry meaning have `alt`, decorative ones
  `alt=""`.
- Announce a lesson's completion with an `aria-live` region so a screen reader is not silent, and
  so the visual state and the spoken state agree.

## PWA

- The service worker precaches the app shell and the audio for unlocked lessons; adding a lesson
  means adding its audio to the precache list.
- The app must render the map offline. If a route cannot work offline, it does not exist in v1.
- Nothing in a component reads `navigator.onLine` to decide behaviour: offline is the normal
  state, not an error state.
