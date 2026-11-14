import { assertLesson, type Lesson } from '../lesson';

/**
 * Lesson 2 — repeat. One instruction, obeyed three times.
 *
 * A palette of one, because the point is that a single instruction can be followed again and again:
 * the repeat game walks the walker three cells from this one tap. The plan is that one step and the
 * repetition lives in the game, so this lesson is one leg with no flags. The concept names what he
 * saw, not what a programmer would call it — "loop" is the parent's word for this.
 */
export const lessonTwo: Lesson = assertLesson({
  id: 'repeat',
  title: 'Do it again',
  order: 2,
  game: {
    gameKind: 'repeat',
    cards: ['step-right'],
    solution: ['step-right'],
  },
  concept: {
    id: 'concept-repeat',
    text: 'You said it once, and it hopped again and again. Three times!',
  },
});
