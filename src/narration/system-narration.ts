import type { Narration } from './port';
import { createSilentNarration } from './silence-narration';

/** Speech parameters from plan D3: a little slower than default, one line at a time. */
export const SPEECH_LANG = 'en-US';
export const SPEECH_RATE = 0.9;
export const SPEECH_PITCH = 1;

/**
 * The device's own voice, via `speechSynthesis`.
 *
 * Cancels whatever is speaking before starting, so a replay restarts the line instead of layering
 * over it (plan D3). Where the API is unavailable — jsdom, an older tablet — it degrades to
 * silence, and the concept still appears on screen (NFR-3).
 */
export function createSystemNarration(): Narration {
  if (typeof window === 'undefined') {
    return createSilentNarration();
  }

  const synth = window.speechSynthesis;

  if (synth === undefined || typeof SpeechSynthesisUtterance !== 'function') {
    return createSilentNarration();
  }

  return {
    speak: (line) => {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = SPEECH_LANG;
      utterance.rate = SPEECH_RATE;
      utterance.pitch = SPEECH_PITCH;

      synth.speak(utterance);
    },
    stop: () => {
      synth.cancel();
    },
  };
}
