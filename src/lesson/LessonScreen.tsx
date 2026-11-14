import { useState } from 'react';
import type { Lesson } from '../content/lesson';
import { findGame } from '../games/registry';
import { createNarration } from '../narration/index';
import type { Narration } from '../narration/port';
import { pictureRegistry } from '../ui/pictures/registry';
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
 * The game reports completion into the flow, which opens the concept beat and speaks its line.
 * The lesson is reported to the shell at that same moment, so the star is earned by finishing the
 * game however the child leaves — by "done" or by the back control (FR-6, FR-7). "Done" only
 * leaves the screen. Until a lesson names a registered game, the cards are shown in their display
 * order instead of a blank screen.
 */
export function LessonScreen({ lesson, onClose, onComplete, narration }: LessonScreenProps) {
  const [fallbackNarration] = useState<Narration>(() => createNarration());
  const flow = useLessonFlow(lesson, narration ?? fallbackNarration);

  const gameKind = lesson.game.gameKind;
  const Game = gameKind === undefined ? undefined : findGame(gameKind);

  const finishGame = () => {
    flow.complete();
    onComplete();
  };

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
        <ConceptScreen lesson={lesson} onReplay={flow.replay} onDone={onClose} />
      ) : Game === undefined ? (
        <GamePending lesson={lesson} />
      ) : (
        <Game lesson={lesson} onComplete={finishGame} />
      )}
    </section>
  );
}

/**
 * What a lesson shows before its game exists: its pictures, in order, and no words.
 *
 * Drawing the sprites rather than their ids keeps the promise that no lesson screen prints a
 * sprite id or an instruction as text (FR-7) — the child sees pictures he can recognise even on
 * a lesson whose game is not written yet.
 */
function GamePending({ lesson }: { readonly lesson: Lesson }) {
  return (
    <div className={styles.pending}>
      <ol className={styles.cards} aria-label="This lesson's steps">
        {lesson.game.cards.map((card) => {
          const Picture = pictureRegistry[card];

          return (
            <li key={card} className={styles.card} data-card={card}>
              <Picture className={styles.cardPicture} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
