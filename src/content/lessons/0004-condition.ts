import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 4 — condition. A red pad makes its arrow go twice.
 *
 * Two arrows plan four steps, as in lesson 3, so the work is the taps he already knows: the road
 * runs right, up, up, right, right, and only the second arrow's tile is red. On that tile the walker
 * takes one more cell in the same direction, so the same four arrows produce six steps — the outcome
 * depends on where he is, not on what he tapped. That is why this stop is a condition and not
 * another order.
 *
 * One leg, no flags: there is one press, and the whole road is its own proof. The concept names both
 * outcomes in his words — "again" for the red tile, and the plain tiles doing it once — and never
 * says "if", "then" or "conditional", which are the parent's vocabulary.
 */
export const lessonFour: Lesson = assertLesson({
  id: 'condition',
  title: 'If it is red',
  order: 4,
  game: {
    gameKind: 'condition',
    cards: ['step-up', 'step-right'],
    solution: ['step-right', 'step-up', 'step-right', 'step-right'],
    twice: [2],
  },
  concept: {
    id: 'concept-condition',
    text: 'It was red, so it went again. You looked, and you knew!',
  },
});
