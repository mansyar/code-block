import type { Lesson, PictureId } from '../content/lesson';
import { pictureRegistry } from '../ui/pictures/registry';
import styles from './ConceptScreen.module.css';

type FinishedStep = { readonly key: string; readonly card: PictureId };

/**
 * Each step of the plan, with a key that is unique even when the plan repeats an arrow.
 *
 * Lesson 3 plans `up, right, right, up`, so a card id is not a key. Counting how many times each
 * arrow has already appeared gives a key that depends only on the plan itself — the same plan always
 * produces the same keys, and the list never needs a position to identify an item.
 */
function finishedSteps(steps: readonly PictureId[]): readonly FinishedStep[] {
  const seen = new Map<PictureId, number>();

  return steps.map((card) => {
    const ordinal = seen.get(card) ?? 0;
    seen.set(card, ordinal + 1);

    return { key: `${card}#${ordinal}`, card };
  });
}

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
      <ol className={styles.finished} aria-label="The steps you placed">
        {finishedSteps(lesson.game.solution).map((step) => {
          const Picture = pictureRegistry[step.card];

          return (
            <li key={step.key} data-finished-card={step.card}>
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
