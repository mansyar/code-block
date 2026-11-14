import { useState } from 'react';
import type { Lesson } from '../content/lesson';
import { findGame } from '../games/registry';
import { createNarration } from '../narration/index';
import type { Narration } from '../narration/port';
import { ConceptScreen } from './ConceptScreen';
import styles from './LessonScreen.module.css';
import { useLessonFlow } from './useLessonFlow';

type LessonScreenProps = {
  readonly lesson: Lesson;
  readonly onClose: () => void;
  readonly onComplete: () => void;
  /** Supplied by tests; the app builds its own from the narration factory. */
  readonly narration?: Narration;
};

/**
 * The lesson screen: play the game, then hear the concept.
 *
 * The game reports completion into the flow, the flow opens the concept beat and speaks its line,
 * and the concept beat's "done" hands the lesson back to the shell. Until a lesson names a
 * registered game, the cards are shown in their display order instead of a blank screen.
 */
export function LessonScreen({ lesson, onClose, onComplete, narration }: LessonScreenProps) {
  const [fallbackNarration] = useState<Narration>(() => createNarration());
  const flow = useLessonFlow(lesson, narration ?? fallbackNarration);

  const gameKind = lesson.game.gameKind;
  const Game = gameKind === undefined ? undefined : findGame(gameKind);

  return (
    <section className={styles.lesson} aria-labelledby="lesson-title">
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={onClose}
          aria-label="Back to the path"
        >
          <span aria-hidden="true">←</span>
        </button>
        <h1 id="lesson-title">{lesson.title}</h1>
      </header>

      {flow.phase === 'concept' ? (
        <ConceptScreen lesson={lesson} onReplay={flow.replay} onDone={onComplete} />
      ) : Game === undefined ? (
        <GamePending lesson={lesson} />
      ) : (
        <Game lesson={lesson} onComplete={flow.complete} />
      )}
    </section>
  );
}

function GamePending({ lesson }: { readonly lesson: Lesson }) {
  return (
    <div className={styles.pending}>
      <p className={styles.note}>This game is still being built.</p>
      <ol className={styles.cards}>
        {lesson.game.cards.map((card) => (
          <li key={card} className={styles.card} data-card={card}>
            {card}
          </li>
        ))}
      </ol>
    </div>
  );
}
