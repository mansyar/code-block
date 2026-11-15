import { useEffect, useState } from 'react';
import type { PictureId } from '../content/lesson';

/** How long an arrow that could not be added keeps its outline. */
export const REFUSED_FLASH_MS = 400;

type Refusal = { readonly card: PictureId; readonly tick: number };

/**
 * The one answer a palette can give when the plan is already full: the tap is refused, and the arrow
 * that was tapped says so for a beat. No word, no disabled button, no shake.
 *
 * A tap that does nothing is indistinguishable from a broken app, so the refusal has to be visible
 * even though it changes nothing about the plan. Both plan games share this so one of them cannot
 * drift into silence.
 *
 * The `tick` makes every refusal a new value, so tapping the same arrow twice in a row restarts the
 * beat instead of leaving the first one to expire.
 */
export function useRefusedArrow() {
  const [refusal, setRefusal] = useState<Refusal | null>(null);

  useEffect(() => {
    if (refusal === null) {
      return undefined;
    }

    const timer = setTimeout(() => setRefusal(null), REFUSED_FLASH_MS);

    return () => clearTimeout(timer);
  }, [refusal]);

  return {
    refusedArrow: refusal?.card ?? null,
    refuseArrow: (card: PictureId) =>
      setRefusal((current) => ({ card, tick: (current?.tick ?? 0) + 1 })),
  };
}
