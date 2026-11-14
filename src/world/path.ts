import type { Lesson, PictureId } from '../content/lesson';

/**
 * The world's geometry: a grid, and steps that mean what they say.
 *
 * `step-up` moves the walker one cell up the screen, `step-right` one cell right, `step-down` one
 * cell down — always, in every lesson. A step is never an abstract "first/second/third"; it is a
 * direction, so a child can look at the road and know which arrow the road needs next.
 */

/** A direction the walker can be told to take. `walker` is the actor, not a step. */
export type StepId = Exclude<PictureId, 'walker'>;

/** Where a cell sits on the grid. `row` grows downwards, the way the screen does. */
export type Cell = { readonly col: number; readonly row: number };

const START: Cell = { col: 0, row: 0 };

/** One cell per step, in the direction the arrow points. Nothing else moves him. */
const DELTA: Readonly<Record<StepId, Cell>> = {
  'step-up': { col: 0, row: -1 },
  'step-right': { col: 1, row: 0 },
  'step-down': { col: 0, row: 1 },
};

export function isStep(id: PictureId): id is StepId {
  return id !== 'walker';
}

/**
 * The cells a run of steps visits, starting cell first.
 *
 * The list *is* the road: consecutive cells are connected, so drawing every cell of the route shows
 * the child the shape he has to walk before he taps anything.
 */
export function tracePath(steps: readonly StepId[]): readonly Cell[] {
  const cells: Cell[] = [START];

  for (const step of steps) {
    const last = cells[cells.length - 1] as Cell;
    const delta = DELTA[step];

    cells.push({ col: last.col + delta.col, row: last.row + delta.row });
  }

  return cells;
}

/**
 * The route a lesson is played along: its solution read as directions.
 *
 * Lesson 1's three cards are therefore also its road — up, right, down — and the same data drives
 * both what the child taps and where the road goes, so they cannot disagree.
 */
export function routeFor(lesson: Lesson): readonly Cell[] {
  const { solution } = lesson.game;
  const steps = solution.filter(isStep);

  if (steps.length !== solution.length) {
    throw new Error(`${lesson.id}: a route step cannot be the walker`);
  }

  return tracePath(steps);
}

/** The route for a lesson that repeats one direction: the same step, `times` cells in a row. */
export function repeatRoute(step: StepId, times: number): readonly Cell[] {
  return tracePath(Array.from({ length: times }, () => step));
}
