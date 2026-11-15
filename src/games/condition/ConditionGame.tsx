import { useEffect, useRef, useState } from 'react';
import type { PictureId } from '../../content/lesson';
import { pictureRegistry } from '../../ui/pictures/registry';
import { isStep, routeFor, type StepId } from '../../world/path';
import { runRoad } from '../../world/run';
import { Track } from '../../world/Track';
import { useRefusedArrow } from '../palette';
import { GoPad } from '../plan/GoPad';
import type { GameProps } from '../registry';
import styles from './ConditionGame.module.css';
import { padIndices, reachOf, spansFor } from './spans';

/** How long the GO pad keeps saying "that plan did not reach the flag". */
const STUCK_FLASH_MS = 500;

/**
 * The condition game: the same four arrows as lesson 3, on a road whose red pads repeat a step.
 *
 * The child plans the arrows he reads off the road and presses GO once. Nothing moves before the
 * press; then the walker takes the whole plan himself, one cell per beat — two cells on a pad —
 * which is the one place his plan is not the whole story. The pad is why the lesson is a condition
 * and not another order: the same tap does a different thing depending on where he is.
 *
 * A wrong plan walks as far as the road honestly allows and halts there, leaving the plan editable,
 * so a mistake is recoverable with one more tap and never a dead end.
 */
export function ConditionGame({ lesson, onComplete, celebrating }: GameProps) {
  const route = routeFor(lesson);
  const { cards, solution, twice } = lesson.game;
  // `routeFor` rejects a plan that names the walker, so filtering is the same set of arrows.
  const spans = spansFor(solution.filter(isStep), twice);
  const pads = padIndices(spans);

  const [plan, setPlan] = useState<readonly StepId[]>([]);
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [done, setDone] = useState(false);
  const finished = useRef(false);
  const cancel = useRef<(() => void) | null>(null);
  const { refusedArrow, refuseArrow } = useRefusedArrow();

  useEffect(() => {
    return () => {
      cancel.current?.();
    };
  }, []);

  useEffect(() => {
    if (!stuck) {
      return undefined;
    }

    const timer = setTimeout(() => setStuck(false), STUCK_FLASH_MS);

    return () => clearTimeout(timer);
  }, [stuck]);

  /** A palette card appends one arrow to the plan, up to the road's own length. */
  function add(card: PictureId) {
    if (running || finished.current || !isStep(card)) {
      return;
    }

    // A plan already as long as the road cannot take another arrow, but the tap is still answered:
    // the card he pressed says so for a beat rather than leaving him to wonder (R1-1).
    if (plan.length >= solution.length) {
      refuseArrow(card);
      return;
    }

    setPlan([...plan, card]);
  }

  /** Tapping a planned arrow takes it back, and everything planned after it. */
  function removeAt(index: number) {
    const span = spans.find((entry) => entry.from === index);

    if (running || finished.current || span === undefined || span.index >= plan.length) {
      return;
    }

    setPlan(plan.slice(0, span.index));
  }

  function go() {
    if (running || finished.current || plan.length === 0) {
      return;
    }

    setRunning(true);
    setStuck(false);

    cancel.current = runRoad({
      route,
      from: position,
      to: reachOf(route, plan, twice),
      onStep: (index) => setPosition(index),
      onHalt: () => {
        setRunning(false);
        setStuck(true);
      },
      onArrive: () => {
        finished.current = true;
        setRunning(false);
        setDone(true);
        onComplete();
      },
    });
  }

  // The plan's arrows sit on the cell each one leaves from — not at the plan's own index, since a
  // repeated step owns two cells and pushes every arrow after it along the road.
  const byCell = new Map(spans.map((span) => [span.from, span.index] as const));
  const placed: readonly (PictureId | undefined)[] = route.map((_, index) => {
    const planned = byCell.get(index);

    return planned === undefined || planned >= plan.length ? undefined : plan[planned];
  });

  return (
    <div className={styles.game} data-stuck={stuck ? 'true' : 'false'}>
      <Track
        route={route}
        position={position}
        placed={placed}
        pads={pads}
        onClear={removeAt}
        celebrating={celebrating}
      />

      <ol className={styles.palette} aria-label="Arrows to plan with">
        {cards.map((card) => {
          const Picture = pictureRegistry[card];
          const full = plan.length >= solution.length;

          return (
            <li key={card} data-card={card}>
              <button
                type="button"
                className={styles.card}
                data-full={full ? 'true' : 'false'}
                data-refused={refusedArrow === card ? 'true' : 'false'}
                disabled={running || done}
                aria-label={card}
                onClick={() => add(card)}
              >
                <Picture className={styles.picture} />
              </button>
            </li>
          );
        })}
      </ol>

      <GoPad disabled={running || done} running={running} stuck={stuck} onPress={go} />
    </div>
  );
}
