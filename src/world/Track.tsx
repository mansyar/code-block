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
};

/**
 * The road every lesson is played along: a route on a grid, the steps already taken, the walker
 * standing on the one he has reached, and a flag where the road ends.
 *
 * The whole route is drawn from the first render, so the road's shape — up, then right, then down —
 * is readable before the child taps anything. That shape, plus arrows that mean the direction they
 * point, is the entire instruction; there is no sentence to read and none is spoken.
 *
 * Deliberately not a list: a road is not a list of items to a child, and keeping it out of the
 * list-item count leaves "how many cards" meaning exactly that everywhere else.
 */
export function Track({ route, position, placed }: TrackProps) {
  const columns = route.map((cell) => cell.col);
  const rows = route.map((cell) => cell.row);
  const minCol = Math.min(...columns);
  const maxCol = Math.max(...columns);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const width = maxCol - minCol + 1;
  const height = maxRow - minRow + 1;
  const goal = route.length - 1;

  return (
    <section
      className={styles.track}
      aria-label="The path"
      data-columns={width}
      data-rows={height}
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
      }}
    >
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
            data-walker={hasWalker ? 'true' : 'false'}
            data-step={step ?? 'none'}
            data-goal={index === goal ? 'true' : 'false'}
          >
            {Step === undefined ? null : <Step className={styles.step} />}
            {index === goal ? <Goal className={styles.goal} /> : null}
            {hasWalker ? <Walker className={styles.walker} /> : null}
          </span>
        );
      })}
    </section>
  );
}
