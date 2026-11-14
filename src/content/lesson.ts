/**
 * The lesson data contract. Content is data: a lesson names its pictures, the order they must be
 * tapped, and the line the narrator says afterwards. Adding a lesson must never require code.
 */
/**
 * The world's whole vocabulary: one actor and the three steps it can be told to take. Every lesson
 * draws from this set, so a lesson never needs art of its own.
 */
export type PictureId = 'walker' | 'step-up' | 'step-right' | 'step-down';

/** Game kinds are registered in `src/games/registry.ts`; a lesson without one is not playable yet. */
export type GameKind = 'sequence';

/** One spoken line. `id` is also the key the audio manifest uses for a pre-rendered clip. */
export type ScriptLine = {
  readonly id: string;
  readonly text: string;
};

export type GameSpec = {
  /** Absent until the game for this lesson exists. */
  readonly gameKind?: GameKind;
  /** The cards as the child first sees them — deliberately not the solution order. */
  readonly cards: readonly PictureId[];
  /** The order that wins. Names every card exactly once. */
  readonly solution: readonly PictureId[];
};

/** What the journey map needs to draw a stop. Lessons without content still appear. */
export type LessonCard = {
  readonly id: string;
  readonly title: string;
  readonly order: number;
};

export type Lesson = LessonCard & {
  readonly game: GameSpec;
  readonly concept: ScriptLine;
};

/**
 * Rejects a malformed lesson at import time, so a content mistake fails the test run with the
 * lesson's own name rather than showing a child an unsolvable game.
 */
export function assertLesson(lesson: Lesson): Lesson {
  const { cards, solution } = lesson.game;

  if (cards.length === 0) {
    throw new Error(`${lesson.id}: a lesson needs at least one card`);
  }

  const distinct = new Set(cards);
  if (distinct.size !== cards.length) {
    throw new Error(`${lesson.id}: the cards contain a duplicate`);
  }

  if (solution.length !== cards.length) {
    throw new Error(`${lesson.id}: the solution must name every card exactly once`);
  }

  for (const card of solution) {
    if (!distinct.has(card)) {
      throw new Error(`${lesson.id}: the solution names "${card}", which is not one of its cards`);
    }
  }

  if (lesson.concept.text.trim() === '') {
    throw new Error(`${lesson.id}: the concept line is empty`);
  }

  return lesson;
}
