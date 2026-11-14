import { findClip } from '../content/audio-manifest';
import type { Narration } from './port';
import { createSystemNarration } from './system-narration';

/** Where a line's pre-rendered clip lives, if it has one. Injectable for tests. */
export type ClipLookup = (lineId: string) => string | undefined;

/**
 * Chooses how a line is spoken (plan D2): a pre-rendered Chatterbox clip when the audio manifest
 * has one for the line id, otherwise the device voice. The manifest ships empty in this track, so
 * everything goes through the system voice — and the later render drops in without touching a
 * single call site.
 */
export function createNarration(lookup: ClipLookup = findClip): Narration {
  const voice = createSystemNarration();
  let clip: HTMLAudioElement | null = null;

  function stopClip() {
    if (clip === null) {
      return;
    }

    clip.pause();
    clip = null;
  }

  return {
    speak: (line) => {
      const source = lookup(line.id);

      if (source === undefined) {
        voice.speak(line);
        return;
      }

      voice.stop();
      stopClip();

      if (typeof Audio !== 'function') {
        return;
      }

      clip = new Audio(source);

      try {
        void clip.play()?.catch(() => {
          // Autoplay refused or the file is unreadable: the line is still on screen (NFR-3).
        });
      } catch {
        // A test environment without a media stack; nothing to recover from.
      }
    },
    stop: () => {
      voice.stop();
      stopClip();
    },
  };
}
