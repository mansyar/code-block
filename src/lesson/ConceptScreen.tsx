import type { Lesson } from '../content/lesson';
import { pictureRegistry } from '../ui/pictures/registry';
import styles from './ConceptScreen.module.css';

type ConceptScreenProps = {
  readonly lesson: Lesson;
  readonly onReplay: () => void;
  readonly onDone: () => void;
};

/**
 * The payoff: the finished picture, the concept line spoken and shown, a replay control, and one
 * obvious way on. Nothing here scolds, scores or times out (FR-5, NFR-3).
 */
export function ConceptScreen({ lesson, onReplay, onDone }: ConceptScreenProps) {
  return (
    <div className={styles.concept}>
      <ol className={styles.finished} aria-label="Your sandwich">
        {lesson.game.solution.map((card) => {
          const Picture = pictureRegistry[card];

          return (
            <li key={card} data-finished-card={card}>
              <Picture className={styles.picture} />
            </li>
          );
        })}
      </ol>

      <p className={styles.line}>{lesson.concept.text}</p>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.replay}
          onClick={onReplay}
          aria-label="Play it again"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7Z" fill="currentColor" />
          </svg>
        </button>

        <button type="button" className={styles.done} onClick={onDone} aria-label="Done">
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M20 6 9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
