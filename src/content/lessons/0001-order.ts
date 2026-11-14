import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 1 — order. Up, then across, then down.
 *
 * The palette is shown down-first so its display order is never the plan's order, and each step is
 * a different arrow so the child has three distinct things to put in a row. One leg, no flags: he
 * taps the plan one card at a time, so there is no run to divide.
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
