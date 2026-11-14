import type { PictureId } from '../content/lesson';
import { pictureRegistry } from '../ui/pictures/registry';
import { Walker } from '../ui/pictures/Walker';
import styles from './Track.module.css';

type TrackProps = {
  /** How many cells the path has, start included. `cellsFor(lesson)` answers this. */
  readonly cells: number;
  /** The cell the walker stands in. `0` is the start. */
  readonly position: number;
  /** The steps already taken, in order. The step at index `i` is drawn in cell `i`. */
  readonly placed: readonly PictureId[];
};

/**
 * The path every lesson is played on: the steps the child has placed, and the walker standing on
 * the one he has reached.
 *
 * Deliberately not a list: a path is not a list of items to a child, and keeping it out of the
 * list-item count leaves "how many cards" meaning exactly that everywhere else.
 */
export function Track({ cells, position, placed }: TrackProps) {
  // A cell's number is its identity — it never reorders, it is the position itself — so it is the
  // honest key rather than a stand-in for one.
  const cellNumbers = Array.from({ length: cells }, (_, number) => number);

  return (
    <section className={styles.track} aria-label="The path">
      {cellNumbers.map((cell) => {
        const step = placed[cell];
        const Step = step === undefined ? undefined : pictureRegistry[step];
        const hasWalker = cell === position;

        return (
          <span
            key={cell}
            className={styles.cell}
            data-cell={cell}
            data-walker={hasWalker ? 'true' : 'false'}
            data-step={step ?? 'none'}
          >
            {Step === undefined ? null : <Step className={styles.step} />}
            {hasWalker ? <Walker className={styles.walker} /> : null}
          </span>
        );
      })}
    </section>
  );
}
