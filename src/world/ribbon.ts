import type { CSSProperties } from 'react';
import type { Cell } from './path';

/**
 * The road's geometry: where a cell sits, and the ribbon that joins two cells that are neighbours.
 *
 * Kept out of `Track.tsx` because a component and its arithmetic want separate files — and because
 * structure rule 2 caps a source file at 200 lines, which the two together had just passed.
 */

/** One stretch of road between two consecutive cells. */
export type Segment = {
  readonly key: string;
  readonly vertical: boolean;
  readonly style: CSSProperties;
};

/** Where a cell's corner sits on one axis, one cell plus one gap per step. */
export function at(index: number): string {
  return `calc(${index} * (var(--cell) + var(--gap)))`;
}

/**
 * The ribbon between consecutive cells: it, and only it, says which cells are joined.
 *
 * A tiled block of four cells reads as an open arena — from the start, the flag looked one step to
 * the right, and nothing on screen contradicted it. Drawing the road only where the walker can
 * actually go removes that reading: the straight line to the flag is simply not drawn.
 */
export function ribbon(route: readonly Cell[], minCol: number, minRow: number): readonly Segment[] {
  const segments: Segment[] = [];

  for (let index = 1; index < route.length; index += 1) {
    const from = route[index - 1] as Cell;
    const to = route[index] as Cell;
    const col = Math.min(from.col, to.col) - minCol;
    const row = Math.min(from.row, to.row) - minRow;
    const vertical = from.col === to.col;

    segments.push({
      key: `${index}:${from.col}:${from.row}-${to.col}:${to.row}`,
      vertical,
      style: vertical
        ? {
            left: `calc(${at(col)} + var(--cell) / 2 - var(--road) / 2)`,
            top: `calc(${at(row)} + var(--cell))`,
            width: 'var(--road)',
            height: 'var(--gap)',
          }
        : {
            left: `calc(${at(col)} + var(--cell))`,
            top: `calc(${at(row)} + var(--cell) / 2 - var(--road) / 2)`,
            width: 'var(--gap)',
            height: 'var(--road)',
          },
    });
  }

  return segments;
}
