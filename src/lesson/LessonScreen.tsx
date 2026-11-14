import type { Lesson } from '../content/lesson';
import { findGame } from '../games/registry';
import styles from './LessonScreen.module.css';

type LessonScreenProps = {
  readonly lesson: Lesson;
  readonly onClose: () => void;
  readonly onComplete: () => void;
};

/**
 * The lesson screen. It hosts whichever game the lesson names; until that game is registered it
 * shows the cards in their display order and says the game is on its way, so the screen is never
 * blank and the ordering is still visible.
 */
export function LessonScreen({ lesson, onClose, onComplete }: LessonScreenProps) {
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

      {Game === undefined ? (
        <GamePending lesson={lesson} />
      ) : (
        <Game lesson={lesson} onComplete={onComplete} />
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
