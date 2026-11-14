import type { CSSProperties } from 'react';
import type { PictureId } from '../content/lesson';
import { pictureRegistry } from '../ui/pictures/registry';
import { Walker } from '../ui/pictures/Walker';
import { Goal } from './Goal';
import type { Cell } from './path';
import styles from './Track.module.css';

type TrackProps = {
  /** The cells of the road, start first. `routeFor(lesson)` answers this. */
  readonly route: readonly Cell[];
  /** The cell the walker stands in — his index along the route, not a coordinate. */
  readonly position: number;
  /** The steps already taken, in order. The step at index `i` is drawn in cell `i`. */
  readonly placed: readonly PictureId[];
  /**
   * Where the flags stand, as indices along the route: one per leg.
   *
   * Defaults to the last cell, which is the single-leg case every lesson before this one has. A
   * two-leg lesson passes both boundaries, so the child sees two places to reach rather than one.
   */
  readonly goals?: readonly number[] | undefined;
  /** True while the arrival is being celebrated: the walker hops, the flag waves, sparks fly. */
  readonly celebrating?: boolean | undefined;
};

/** Where the arrival's sparks fly. Six of them, one every 60°, so the burst reads as a burst. */
const SPARK_ANGLES = [0, 60, 120, 180, 240, 300] as const;

type Segment = {
  readonly key: string;
  readonly vertical: boolean;
  readonly style: CSSProperties;
};

/** Where a cell's corner sits on one axis, one cell plus one gap per step. */
function at(index: number): string {
  return `calc(${index} * (var(--cell) + var(--gap)))`;
}

/**
 * The ribbon between consecutive cells: it, and only it, says which cells are joined.
 *
 * A tiled block of four cells reads as an open arena — from the start, the flag looked one step to
 * the right, and nothing on screen contradicted it. Drawing the road only where the walker can
 * actually go removes that reading: the straight line to the flag is simply not drawn.
 */
function ribbon(route: readonly Cell[], minCol: number, minRow: number): readonly Segment[] {
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

/**
 * The road every lesson is played along: a ribbon joining the cells the walker can actually walk,
 * his own cell, and a flag wherever a leg of the plan ends — one flag for a single-leg lesson, two
 * for a lesson written in two legs.
 *
 * The start is a pad and the finish is a pad, drawn differently from the road between them, so a
 * child sees two places rather than four interchangeable tiles. The ribbon is the instruction:
 * where it runs, he may go; where it does not, he may not. No sentence says so and none is spoken.
 */
export function Track({ route, position, placed, goals, celebrating = false }: TrackProps) {
  const columns = route.map((cell) => cell.col);
  const rows = route.map((cell) => cell.row);
  const minCol = Math.min(...columns);
  const maxCol = Math.max(...columns);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const width = maxCol - minCol + 1;
  const height = maxRow - minRow + 1;
  // Every leg ends at a flag; a lesson that declares no legs has exactly one, at the end.
  const flags = goals ?? [route.length - 1];
  // The arrival the celebration belongs to: the last flag, never the intermediate one.
  const lastFlag = flags[flags.length - 1] ?? route.length - 1;
  const finish = route[lastFlag] as Cell;
  // Big enough to read on a tablet, never so big that the widest lesson overflows the panel.
  const cell = `min(calc(var(--tap-target) * 1.75), calc((26rem - 2 * var(--space-3) - ${width - 1} * var(--space-3)) / ${width}))`;

  return (
    <section className={styles.frame} aria-label="The path">
      <div
        className={styles.track}
        data-columns={width}
        data-rows={height}
        data-celebrate={celebrating ? 'true' : 'false'}
        style={
          {
            '--cell': cell,
            gridTemplateColumns: `repeat(${width}, var(--cell))`,
            gridTemplateRows: `repeat(${height}, var(--cell))`,
          } as CSSProperties
        }
      >
        {ribbon(route, minCol, minRow).map((segment) => (
          <span
            key={segment.key}
            className={styles.road}
            data-road={segment.vertical ? 'vertical' : 'horizontal'}
            style={segment.style}
          />
        ))}

        {celebrating ? (
          <span
            className={styles.sparks}
            aria-hidden="true"
            data-sparks="true"
            style={{
              left: `calc(${at(finish.col - minCol)} + var(--cell) / 2)`,
              top: `calc(${at(finish.row - minRow)} + var(--cell) / 2)`,
            }}
          >
            {SPARK_ANGLES.map((angle) => (
              <span
                key={angle}
                className={styles.spark}
                style={{ '--angle': `${angle}deg` } as CSSProperties}
              />
            ))}
          </span>
        ) : null}

        {route.map((cell, index) => {
          const step = placed[index];
          const Step = step === undefined ? undefined : pictureRegistry[step];
          const hasWalker = index === position;

          return (
            <span
              key={`${cell.col}:${cell.row}`}
              className={styles.cell}
              style={{ gridColumn: cell.col - minCol + 1, gridRow: cell.row - minRow + 1 }}
              data-cell={index}
              data-col={cell.col}
              data-row={cell.row}
              data-start={index === 0 ? 'true' : 'false'}
              data-walker={hasWalker ? 'true' : 'false'}
              data-step={step ?? 'none'}
              data-goal={flags.includes(index) ? 'true' : 'false'}
            >
              {Step === undefined ? null : <Step className={styles.step} />}
              {flags.includes(index) ? <Goal className={styles.goal} /> : null}
              {hasWalker ? <Walker className={styles.walker} /> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}
