import type { ScriptLine } from '../content/lesson';
import type { Narration } from './port';

/**
 * Speaks nothing. Used when the device has no speech engine, and by tests that want to observe
 * calls without a browser voice.
 */
export function createSilentNarration(onLine?: (line: ScriptLine) => void): Narration {
  return {
    speak: (line) => {
      onLine?.(line);
    },
    stop: () => {},
  };
}
