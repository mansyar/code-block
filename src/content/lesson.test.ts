import { describe, expect, it } from 'vitest';
import { assertLesson, type GameSpec, type Lesson } from './lesson';
import { curriculum, lessons } from './lessons/index';

/**
 * The contract's own rules: what a palette is, what a plan may be, and where a leg may end.
 *
 * These are asserted here rather than through a game, because they are what every later lesson
 * inherits — a content mistake must fail at import with the lesson's id, not confuse a child.
 */

function sample(game: GameSpec): Lesson {
  return {
    id: 'sample',
    title: 'Sample',
    order: 9,
    game,
    concept: { id: 'concept-sample', text: 'You did it.' },
  };
}

const TWO_ARROWS = ['step-up', 'step-right'] as const;
const FOUR_STEPS = ['step-up', 'step-right', 'step-right', 'step-up'] as const;

describe('the lesson contract — palette and plan', () => {
  it('accepts a plan longer than the palette, because two arrows can plan four steps', () => {
    const lesson = sample({ cards: TWO_ARROWS, solution: FOUR_STEPS });

    expect(assertLesson(lesson)).toBe(lesson);
  });

  it('accepts a plan that repeats a planned arrow', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: ['step-up', 'step-up'] })),
    ).not.toThrow();
  });

  it('rejects a duplicate card in the palette', () => {
    expect(() =>
      assertLesson(sample({ cards: ['step-up', 'step-up'], solution: ['step-up'] })),
    ).toThrow(/sample: the cards contain a duplicate/);
  });

  it('rejects an empty plan', () => {
    expect(() => assertLesson(sample({ cards: TWO_ARROWS, solution: [] }))).toThrow(
      /sample: the plan is empty/,
    );
  });

  it('rejects a plan step the palette does not hold, naming it', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: ['step-up', 'step-down'] })),
    ).toThrow(/"step-down", which is not one of its cards/);
  });

  it('rejects an empty concept line', () => {
    const lesson: Lesson = { ...sample({ cards: TWO_ARROWS, solution: ['step-up'] }) };

    expect(() =>
      assertLesson({
        ...lesson,
        concept: { id: 'concept-sample', text: '  ' },
      }),
    ).toThrow(/sample: the concept line is empty/);
  });
});

describe('the lesson contract — legs', () => {
  it('accepts two legs whose last flag is the end of the plan', () => {
    const lesson = sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags: [2, 4] });

    expect(assertLesson(lesson)).toBe(lesson);
  });

  it('accepts a single leg declared as one flag at the end', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags: [4] })),
    ).not.toThrow();
  });

  it('treats a lesson without flags as one leg', () => {
    const lesson = sample({ cards: TWO_ARROWS, solution: FOUR_STEPS });

    expect(lesson.game.flags).toBeUndefined();
    expect(assertLesson(lesson).game.flags).toBeUndefined();
  });

  it('rejects an empty flag list, which claims legs that do not exist', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags: [] })),
    ).toThrow(/sample: flags is empty; omit it for a single leg/);
  });

  it('rejects a repeated flag, and a descending one', () => {
    for (const flags of [
      [2, 2],
      [4, 2],
    ]) {
      expect(() =>
        assertLesson(sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags })),
      ).toThrow(/sample: the flags must be strictly increasing/);
    }
  });

  it('rejects a flag past the end of the plan', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags: [2, 5] })),
    ).toThrow(/sample: flag 5 is past the end of a 4-step plan/);
  });

  it('rejects flags that stop short of the end of the plan', () => {
    expect(() =>
      assertLesson(sample({ cards: TWO_ARROWS, solution: FOUR_STEPS, flags: [2] })),
    ).toThrow(/sample: the last flag must be the end of the plan \(4\)/);
  });
});

describe('the lessons that ship', () => {
  it('passes every content lesson through the contract, with a stop for each curriculum entry', () => {
    for (const lesson of lessons) {
      expect(assertLesson(lesson), `${lesson.id} is malformed`).toBe(lesson);
      expect(curriculum.some((stop) => stop.id === lesson.id)).toBe(true);
    }
  });

  it('keeps lessons 1 and 2 as one leg each, planned card for card', () => {
    for (const lesson of lessons.filter((entry) => entry.order <= 2)) {
      expect(lesson.game.flags, `${lesson.id} must stay a single leg`).toBeUndefined();
      expect(lesson.game.solution.length, `${lesson.id} plans one step per card`).toBe(
        lesson.game.cards.length,
      );
    }
  });

  it('holds six stops, still naming lesson 3 "Make it move" at order 3', () => {
    expect(curriculum).toHaveLength(6);
    expect(curriculum.find((stop) => stop.id === 'cause')).toEqual({
      id: 'cause',
      title: 'Make it move',
      order: 3,
    });
  });
});
