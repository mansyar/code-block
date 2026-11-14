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
export type GameKind = 'sequence' | 'repeat' | 'plan' | 'condition';

/** One spoken line. `id` is also the key the audio manifest uses for a pre-rendered clip. */
export type ScriptLine = {
  readonly id: string;
  readonly text: string;
};

export type GameSpec = {
  /** Absent until the game for this lesson exists. */
  readonly gameKind?: GameKind;
  /**
   * The palette: the cards the child may plan with, as he first sees them — deliberately not the
   * plan's order, and not one card per step.
   */
  readonly cards: readonly PictureId[];
  /**
   * The plan: the whole road in the order that wins, which `routeFor` also reads to draw the road.
   *
   * It may be longer than the palette — a four-step walk can be planned from two arrows, and the
   * same arrow may be planned twice — but it may never name an arrow the palette does not hold.
   */
  readonly solution: readonly PictureId[];
  /**
   * Where the plan's legs end, as positions in the plan: `[2, 4]` is two legs of two steps.
   *
   * Absent means one leg that ends at the end of the plan. A leg is written, run, then the next one
   * is planned from wherever the walker now stands, so the boundary has to be data rather than a
   * guess the game makes.
   */
  readonly flags?: readonly number[] | undefined;
  /**
   * Plan positions whose step the road takes twice, counted from 1 the way `flags` is: `[2]` is a
   * road where the second arrow carries the walker two cells instead of one.
   *
   * Absent means no step repeats, so every lesson that names nothing behaves exactly as before.
   * The road is derived from this, which is what keeps the drawn road and the walk the same list.
   */
  readonly twice?: readonly number[] | undefined;
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
  const { cards, solution, flags, twice } = lesson.game;

  if (cards.length === 0) {
    throw new Error(`${lesson.id}: a lesson needs at least one card`);
  }

  const palette = new Set(cards);
  if (palette.size !== cards.length) {
    throw new Error(`${lesson.id}: the cards contain a duplicate`);
  }

  if (solution.length === 0) {
    throw new Error(`${lesson.id}: the plan is empty`);
  }

  for (const step of solution) {
    if (!palette.has(step)) {
      throw new Error(`${lesson.id}: the plan names "${step}", which is not one of its cards`);
    }
  }

  assertFlags(lesson, flags, solution.length);
  assertTwice(lesson, twice, solution.length);

  if (lesson.concept.text.trim() === '') {
    throw new Error(`${lesson.id}: the concept line is empty`);
  }

  return lesson;
}

/**
 * A repeat rule names real plan positions, once each, in order. A position of 0 or one past the end
 * names a step that does not exist, and a duplicate would grow the road twice for one arrow — both
 * are content mistakes that must fail at import rather than reach a child.
 */
function assertTwice(
  lesson: Lesson,
  twice: readonly number[] | undefined,
  planLength: number,
): void {
  if (twice === undefined) {
    return;
  }

  if (twice.length === 0) {
    throw new Error(`${lesson.id}: twice is empty; omit it when no step repeats`);
  }

  let previous = 0;

  for (const position of twice) {
    if (!Number.isInteger(position) || position <= previous) {
      throw new Error(
        `${lesson.id}: the twice positions must be strictly increasing, got ${twice.join(', ')}`,
      );
    }

    if (position > planLength) {
      throw new Error(
        `${lesson.id}: twice names step ${position}, past the end of a ${planLength}-step plan`,
      );
    }

    previous = position;
  }
}

/**
 * Legs must carve the plan up completely: strictly increasing positions, none past the end, and the
 * last one exactly at the end. A plan with an unclaimed tail would leave the child holding steps
 * that no press could ever run.
 */
function assertFlags(
  lesson: Lesson,
  flags: readonly number[] | undefined,
  planLength: number,
): void {
  if (flags === undefined) {
    return;
  }

  if (flags.length === 0) {
    throw new Error(`${lesson.id}: flags is empty; omit it for a single leg`);
  }

  let previous = 0;

  for (const position of flags) {
    if (!Number.isInteger(position) || position <= previous) {
      throw new Error(
        `${lesson.id}: the flags must be strictly increasing, got ${flags.join(', ')}`,
      );
    }

    if (position > planLength) {
      throw new Error(
        `${lesson.id}: flag ${position} is past the end of a ${planLength}-step plan`,
      );
    }

    previous = position;
  }

  if (previous !== planLength) {
    throw new Error(`${lesson.id}: the last flag must be the end of the plan (${planLength})`);
  }
}
