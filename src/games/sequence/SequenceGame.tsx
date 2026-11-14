import { useEffect, useRef, useState } from 'react';
import type { PictureId } from '../../content/lesson';
import { pictureRegistry } from '../../ui/pictures/registry';
import { routeFor } from '../../world/path';
import { Track } from '../../world/Track';
import type { GameProps } from '../registry';
import styles from './SequenceGame.module.css';

const WRONG_FLASH_MS = 500;

/**
 * The order game: tap the cards in the lesson's solution order.
 *
 * Each card is a direction, so a correct tap moves the walker one cell *that way* along the road he
 * can already see, and locks the card he obeyed. A wrong tap wobbles the card and moves nothing —
 * there is no road that way — with no penalty and no lost progress (FR-4, FR-9). Completion is
 * reported once, however many times the last card is tapped.
 */
export function SequenceGame({ lesson, onComplete, celebrating }: GameProps) {
  const [placed, setPlaced] = useState<readonly PictureId[]>([]);
  const [wrong, setWrong] = useState<PictureId | null>(null);
  const finished = useRef(false);
  const { cards, solution } = lesson.game;
  const route = routeFor(lesson);
  const expected = solution[placed.length];

  useEffect(() => {
    if (wrong === null) {
      return;
    }

    const timer = setTimeout(() => setWrong(null), WRONG_FLASH_MS);

    return () => clearTimeout(timer);
  }, [wrong]);

  function tap(card: PictureId) {
    if (finished.current || placed.some((done) => done === card)) {
      return;
    }

    if (card !== expected) {
      setWrong(card);
      return;
    }

    const next = [...placed, card];
    setPlaced(next);
    setWrong(null);

    if (next.length === solution.length) {
      finished.current = true;
      onComplete();
    }
  }

  return (
    <div className={styles.game}>
      <Track route={route} position={placed.length} placed={placed} celebrating={celebrating} />

      <ol className={styles.tray} aria-label="Cards to tap">
        {cards.map((card) => {
          const Picture = pictureRegistry[card];
          const isPlaced = placed.some((done) => done === card);

          return (
            <li key={card} data-card={card}>
              <button
                type="button"
                className={styles.card}
                data-placed={isPlaced ? 'true' : 'false'}
                data-wrong={wrong === card ? 'true' : 'false'}
                disabled={isPlaced}
                aria-label={isPlaced ? `${card}, placed` : card}
                onClick={() => tap(card)}
              >
                <Picture className={styles.picture} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
