import type { Lesson } from '../content/lesson';

/**
 * The shared answers about walking the path, so both games agree without either of them owning
 * the numbers.
 */

/** How long one cell of the walk takes. Slow enough to follow, short enough to feel like a reply. */
export const STEP_MS = 350;

/**
 * The path a lesson is played on: one cell to start in, plus one for every step the child places.
 *
 * Derived from the lesson rather than configured, so a lesson with two steps cannot be drawn on a
 * track built for three.
 */
export function cellsFor(lesson: Lesson): number {
  return lesson.game.solution.length + 1;
}
