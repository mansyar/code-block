import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 1 — order. Bread, then cheese, then the top slice.
 *
 * The cards are shown cheese-first so the display order is never the solution order.
 */
export const lessonOne: Lesson = assertLesson({
  id: 'order',
  title: 'Make a sandwich',
  order: 1,
  game: {
    gameKind: 'sequence',
    cards: ['cheese', 'top', 'bread'],
    solution: ['bread', 'cheese', 'top'],
  },
  concept: {
    id: 'concept-order',
    text: 'You made it! You told it the order: first the bread, then the cheese, then the top.',
  },
});
