import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 1 — order. Up, then across, then down.
 *
 * The cards are shown down-first so the display order is never the solution order, and each step
 * is a different arrow so the child has three distinct things to put in a row.
 */
export const lessonOne: Lesson = assertLesson({
  id: 'order',
  title: 'Walk the path',
  order: 1,
  game: {
    gameKind: 'sequence',
    cards: ['step-down', 'step-up', 'step-right'],
    solution: ['step-up', 'step-right', 'step-down'],
  },
  concept: {
    id: 'concept-order',
    text: 'You did it! You told it the order: up first, then across, then down.',
  },
});
