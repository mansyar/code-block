import type { Cell } from './path';

/**
 * The road's geometry: where a cell sits, and which of its sides a connection leaves by.
 *
 * Kept out of `Track.tsx` because a component and its arithmetic want separate files — and because
 * structure rule 2 caps a source file at 200 lines, which the two together had just passed.
 */

/** A side of a cell that the road leaves by. */
export type Link = 'up' | 'right' | 'down' | 'left';

/** Where a cell's corner sits on one axis, one cell plus one gap per step. */
export function at(index: number): string {
  return `calc(${index} * (var(--cell) + var(--gap)))`;
}

/**
 * The connections leaving one cell, as the sides the road is drawn toward.
 *
 * Each cell draws its own half of every stretch — a band from its centre that meets its neighbour's
 * half out in the gap — so the road runs *through* the tiles instead of appearing only between them.
 * A cell the route passes through answers with two sides, a cell at either end with one, and a cell
 * the route does not join with none, which is the whole rule about where the walker may go.
 */
export function links(route: readonly Cell[], index: number): readonly Link[] {
  const cell = route[index];

  if (cell === undefined) {
    return [];
  }

  const sides: Link[] = [];

  for (const neighbour of [route[index - 1], route[index + 1]]) {
    if (neighbour === undefined) {
      continue;
    }

    const side = sideOf(cell, neighbour);

    // A road that doubles back over itself leaves the same side twice, and that is one band.
    if (!sides.includes(side)) {
      sides.push(side);
    }
  }

  return sides;
}

/** The side of `from` that `to` lies on. Consecutive route cells are always grid neighbours. */
function sideOf(from: Cell, to: Cell): Link {
  if (to.col > from.col) {
    return 'right';
  }

  if (to.col < from.col) {
    return 'left';
  }

  return to.row > from.row ? 'down' : 'up';
}
