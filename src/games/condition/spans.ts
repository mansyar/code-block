import type { StepId } from '../../world/path';
import { after, type Cell } from '../../world/path';

/**
 * How one planned step lands on the road.
 *
 * A lesson may say that a step is taken twice (`twice`, positions counted from 1). One planned
 * arrow then covers two cells, so the game cannot count route indices the way the plan counts
 * steps — it needs to know which cells each arrow owns.
 */
export type Span = {
  /** The step's position in the plan, counted from 0. */
  readonly index: number;
  /** The arrow it is. */
  readonly step: StepId;
  /** The route index it leaves from. */
  readonly from: number;
  /** The route index it lands on: one further, or two when the tile says again. */
  readonly to: number;
};

/** How many cells one planned step covers: two when its position is in `twice`, else one. */
export function spanLength(twice: readonly number[] | undefined, index: number): 1 | 2 {
  return twice?.includes(index + 1) === true ? 2 : 1;
}

/** One span per planned step, in plan order, each starting where the one before it landed. */
export function spansFor(
  solution: readonly StepId[],
  twice: readonly number[] | undefined,
): readonly Span[] {
  const spans: Span[] = [];
  let at = 0;

  solution.forEach((step, index) => {
    const length = spanLength(twice, index);

    spans.push({ index, step, from: at, to: at + length });
    at += length;
  });

  return spans;
}

/** The route indices that carry a repeat: the tiles the walker lands on twice-arrow cells. */
export function padIndices(spans: readonly Span[]): readonly number[] {
  return spans.filter((span) => span.to - span.from === 2).map((span) => span.to);
}

/**
 * How far a plan actually reaches along the road.
 *
 * Each planned arrow is compared with the road's next cell — and with the cell after it when that
 * arrow is taken twice — so a plan that turns the wrong way stops exactly where the world stops.
 * The answer is a route index: the last cell the plan can honestly reach from `from`.
 */
export function reachOf(
  route: readonly Cell[],
  plan: readonly StepId[],
  twice: readonly number[] | undefined,
): number {
  let at = 0;

  for (let index = 0; index < plan.length; index += 1) {
    const here = route[at];
    const wanted = route[at + 1];
    const step = plan[index] as StepId;

    if (here === undefined || wanted === undefined) {
      return at;
    }

    const landed = after(here, step);

    if (landed.col !== wanted.col || landed.row !== wanted.row) {
      return at;
    }

    at += 1;

    if (spanLength(twice, index) === 2) {
      const beyond = route[at + 1];
      const again = after(route[at] as Cell, step);

      if (beyond === undefined || again.col !== beyond.col || again.row !== beyond.row) {
        return at;
      }

      at += 1;
    }
  }

  return at;
}
