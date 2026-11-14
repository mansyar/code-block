import { useEffect, useRef, useState } from 'react';
import type { PictureId } from '../../content/lesson';
import { pictureRegistry } from '../../ui/pictures/registry';
import { isStep, repeatRoute, tracePath } from '../../world/path';
import { Track } from '../../world/Track';
import { STEP_MS } from '../../world/walk';
import type { GameProps } from '../registry';
import styles from './RepeatGame.module.css';

/** One instruction, three steps. The count lives here because the path has three cells (D5). */
const REPEAT_STEPS = 3;

/**
 * The repeat game: one arrow, tapped once, and the walker takes the same step three times.
 *
 * The child gives one instruction and watches it happen again and again, which is a loop shown as
 * a picture rather than explained in a word. The road runs three cells in the arrow's own direction
 * — right means right — so repetition is the only new thing on screen (FR-10). The steps he has
 * taken stay on the road behind him, so the repetition is visible after the fact as well as during
 * it.
 *
 * A second tap while he is walking changes nothing: the game has already been given its
 * instruction, and completion is reported exactly once (FR-4).
 */
export function RepeatGame({ lesson, onComplete, celebrating }: GameProps) {
  const card = lesson.game.solution[0];
  const [walked, setWalked] = useState(0);
  const [walking, setWalking] = useState(false);
  const finished = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;

    return () => {
      for (const timer of pending) {
        clearTimeout(timer);
      }
    };
  }, []);

  function start() {
    if (walking || finished.current) {
      return;
    }

    setWalking(true);

    for (let step = 1; step <= REPEAT_STEPS; step += 1) {
      timers.current.push(
        setTimeout(() => {
          setWalked(step);

          if (step === REPEAT_STEPS) {
            finished.current = true;
            setWalking(false);
            onComplete();
          }
        }, STEP_MS * step),
      );
    }
  }

  const taken: PictureId[] = card === undefined ? [] : Array.from({ length: walked }, () => card);
  const Instruction = card === undefined ? undefined : pictureRegistry[card];
  const route =
    card !== undefined && isStep(card) ? repeatRoute(card, REPEAT_STEPS) : tracePath([]);
  const done = walked === REPEAT_STEPS;

  return (
    <div className={styles.game}>
      <Track route={route} position={walked} placed={taken} celebrating={celebrating} />

      <button
        type="button"
        className={styles.card}
        data-walking={walking ? 'true' : 'false'}
        disabled={done}
        aria-label="Go"
        onClick={start}
      >
        {Instruction === undefined ? null : <Instruction className={styles.arrow} />}
      </button>
    </div>
  );
}
