import { useCallback, useEffect, useState } from 'react';
import type { Lesson } from '../content/lesson';
import type { Narration } from '../narration/port';

export type LessonPhase = 'playing' | 'concept';

/**
 * The lesson's two beats: play the game, then hear the idea it taught.
 *
 * The concept line is spoken once when the beat opens, and `replay` speaks it again from the
 * start. Speech failures are swallowed: a device with no voice still gets the picture and the
 * written line, so the lesson completes (NFR-3).
 */
export function useLessonFlow(lesson: Lesson, narration: Narration) {
  const [phase, setPhase] = useState<LessonPhase>('playing');

  useEffect(() => {
    if (phase !== 'concept') {
      return;
    }

    try {
      narration.speak(lesson.concept);
    } catch {
      // No voice, no crash — the concept is also on screen.
    }
  }, [phase, lesson, narration]);

  useEffect(() => {
    return () => {
      try {
        narration.stop();
      } catch {
        // Nothing to stop if the port is already gone.
      }
    };
  }, [narration]);

  const complete = useCallback(() => {
    setPhase('concept');
  }, []);

  const replay = useCallback(() => {
    try {
      narration.speak(lesson.concept);
    } catch {
      // Same as above: replay is a convenience, not a requirement.
    }
  }, [lesson, narration]);

  return { phase, complete, replay };
}
