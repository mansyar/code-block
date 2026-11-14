import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 3 — cause and effect. Plan a leg, press GO, and the walker does what he wrote.
 *
 * Two arrows plan four steps, so the palette stays the size of a hand and the road still turns two
 * corners. The road runs up, right, right, up, so the first leg is up-then-right and the second is
 * right-then-up: the same two arrows in the other order, which means the second plan has to be read
 * off the board he is standing on instead of replayed from memory (D10).
 *
 * The flags are the two legs' ends (D3). At the first one the plan is cleared and the walker is not,
 * so the child gets two presses, two marches and a win halfway through (D4). The concept names the
 * two causes in his words; "event" and "trigger" are the parent's vocabulary.
 */
export const lessonThree: Lesson = assertLesson({
  id: 'cause',
  title: 'Make it move',
  order: 3,
  game: {
    gameKind: 'plan',
    cards: ['step-up', 'step-right'],
    solution: ['step-up', 'step-right', 'step-right', 'step-up'],
    flags: [2, 4],
  },
  concept: {
    id: 'concept-cause',
    text: 'You said go, and it went. Then you said go again — and it went again!',
  },
});
