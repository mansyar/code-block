import { useEffect, useRef, useState } from 'react';
import type { PictureId } from '../../content/lesson';
import { pictureRegistry } from '../../ui/pictures/registry';
import { isStep, routeFor, type StepId } from '../../world/path';
import { runPlan } from '../../world/run';
import { Track } from '../../world/Track';
import type { GameProps } from '../registry';
import { GoPad } from './GoPad';
import styles from './PlanGame.module.css';

/** How long the GO pad keeps saying "that plan did not reach the flag". */
const STUCK_FLASH_MS = 500;

/**
 * The plan game: write a leg, press GO once, watch it run to its flag, then plan the next one.
 *
 * Nothing moves until GO, and then the walker carries out the whole leg by himself — that is the
 * cause and the effect the lesson is about. The road is the plan, so a wrong plan walks exactly as
 * far as the road allows and halts there: no reset, no penalty, and the leg stays editable (FR-8).
 *
 * At a flag that is not the last, the plan is cleared and the walker is not (D4). He stands where
 * his own plan put him, the palette comes back, and the next leg is written from there — two causes
 * rather than one long programme. The final flag reports completion to the lesson screen and lets
 * the arrival be celebrated.
 */
export function PlanGame({ lesson, onComplete, celebrating }: GameProps) {
  const route = routeFor(lesson);
  const { cards, solution, flags } = lesson.game;
  // Where each leg ends, as route indices; a lesson without legs has one, at the end of its road.
  const legs: readonly number[] = flags ?? [solution.length];

  const [legIndex, setLegIndex] = useState(0);
  const [plan, setPlan] = useState<readonly StepId[]>([]);
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [done, setDone] = useState(false);
  const finished = useRef(false);
  const cancel = useRef<(() => void) | null>(null);

  const legStart = legIndex === 0 ? 0 : (legs[legIndex - 1] as number);
  const legEnd = legs[legIndex] ?? route.length - 1;
  const capacity = legEnd - legStart;

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

  /** A palette card appends to this leg's plan, up to the leg's length. */
  function add(card: PictureId) {
    if (running || finished.current || !isStep(card) || plan.length >= capacity) {
      return;
    }

    setPlan([...plan, card]);
  }

  /** Tapping a planned step takes it back, and everything he planned after it. */
  function removeAt(index: number) {
    const offset = index - legStart;

    if (running || finished.current || offset < 0 || offset >= plan.length) {
      return;
    }

    setPlan(plan.slice(0, offset));
  }

  function go() {
    if (running || finished.current || plan.length === 0) {
      return;
    }

    setRunning(true);
    setStuck(false);

    cancel.current = runPlan({
      route,
      plan,
      from: position,
      to: legEnd,
      onStep: (index) => setPosition(index),
      onHalt: () => {
        setRunning(false);
        setStuck(true);
      },
      onArrive: () => {
        setRunning(false);

        if (legIndex === legs.length - 1) {
          finished.current = true;
          setDone(true);
          onComplete();
          return;
        }

        // A flag, not an ending: a new plan, the same walker, the cell he reached.
        setLegIndex(legIndex + 1);
        setPlan([]);
      },
    });
  }

  const placed: readonly (PictureId | undefined)[] = route.map((_, index) =>
    index >= legStart && index < legStart + plan.length ? plan[index - legStart] : undefined,
  );

  return (
    <div className={styles.game} data-stuck={stuck ? 'true' : 'false'}>
      <Track
        route={route}
        position={position}
        placed={placed}
        goals={legs}
        onClear={removeAt}
        celebrating={celebrating}
      />

      <ol className={styles.palette} aria-label="Arrows to plan with">
        {cards.map((card) => {
          const Picture = pictureRegistry[card];
          const full = plan.length >= capacity;

          return (
            <li key={card} data-card={card}>
              <button
                type="button"
                className={styles.card}
                data-full={full ? 'true' : 'false'}
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
