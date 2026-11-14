import type { LessonCard } from '../content/lesson';
import type { Progress } from '../progress/schema';
import { isComplete, isUnlocked } from '../progress/selectors';
import styles from './JourneyMap.module.css';

type JourneyMapProps = {
  readonly curriculum: readonly LessonCard[];
  readonly progress: Progress;
  readonly onOpen: (lessonId: string) => void;
};

/**
 * The journey map: one stop per curriculum entry, in order.
 *
 * A locked stop is disabled and carries a lock silhouette, so state is readable by shape as well
 * as by colour (FR-2, NFR-2).
 */
export function JourneyMap({ curriculum, progress, onOpen }: JourneyMapProps) {
  return (
    <section className={styles.map} aria-labelledby="path-title">
      <h1 id="path-title" className={styles.title}>
        Your path
      </h1>
      <ol className={styles.path}>
        {curriculum.map((lesson, index) => {
          const unlocked = isUnlocked(lesson, curriculum, progress);
          const done = isComplete(lesson, progress);
          const state = done ? 'done' : unlocked ? 'ready' : 'locked';

          return (
            <li key={lesson.id} className={styles.stop}>
              <button
                type="button"
                className={styles.node}
                data-state={state}
                disabled={!unlocked}
                aria-disabled={!unlocked}
                aria-label={`Lesson ${index + 1}: ${lesson.title}, ${state}`}
                onClick={() => onOpen(lesson.id)}
              >
                <span className={styles.number}>{index + 1}</span>
                <Marker state={state} />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Marker({ state }: { readonly state: string }) {
  if (state === 'done') {
    return <StarMarker />;
  }

  return state === 'ready' ? <PlayMarker /> : <LockMarker />;
}

function PlayMarker() {
  return (
    <svg className={styles.marker} data-marker="play" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5 19 12 8 18.5Z" />
    </svg>
  );
}

function StarMarker() {
  return (
    <svg className={styles.marker} data-marker="star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9L3.5 9.7l5.9-.8z" />
    </svg>
  );
}

function LockMarker() {
  return (
    <svg className={styles.marker} data-marker="lock" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path
        d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
