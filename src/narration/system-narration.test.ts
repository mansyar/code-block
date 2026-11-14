import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSystemNarration, SPEECH_LANG, SPEECH_PITCH, SPEECH_RATE } from './system-narration';

type Spoken = { text: string; lang: string; rate: number; pitch: number };

const calls: string[] = [];
const spoken: Spoken[] = [];

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;

  constructor(text: string) {
    this.text = text;
  }
}

function stubSpeechEngine() {
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      cancel: () => calls.push('cancel'),
      speak: (utterance: FakeUtterance) => {
        calls.push('speak');
        spoken.push({
          text: utterance.text,
          lang: utterance.lang,
          rate: utterance.rate,
          pitch: utterance.pitch,
        });
      },
    },
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
}

describe('createSystemNarration', () => {
  beforeEach(() => {
    calls.length = 0;
    spoken.length = 0;
    stubSpeechEngine();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, 'speechSynthesis');
  });

  it('speaks the line with the parameters from D3', () => {
    const narration = createSystemNarration();

    narration.speak({ id: 'concept-order', text: 'You made it!' });

    expect(spoken).toEqual([
      { text: 'You made it!', lang: SPEECH_LANG, rate: SPEECH_RATE, pitch: SPEECH_PITCH },
    ]);
    expect(SPEECH_LANG).toBe('en-US');
    expect(SPEECH_RATE).toBe(0.9);
    expect(SPEECH_PITCH).toBe(1);
  });

  it('cancels the previous line before starting the next', () => {
    const narration = createSystemNarration();

    narration.speak({ id: 'a', text: 'one' });
    narration.speak({ id: 'b', text: 'two' });

    expect(calls).toEqual(['cancel', 'speak', 'cancel', 'speak']);
  });

  it('stops on demand', () => {
    const narration = createSystemNarration();

    narration.stop();

    expect(calls).toEqual(['cancel']);
  });

  it('falls back to silence when the device has no speech engine', () => {
    Reflect.deleteProperty(window, 'speechSynthesis');
    const narration = createSystemNarration();

    expect(() => narration.speak({ id: 'a', text: 'one' })).not.toThrow();
    expect(spoken).toEqual([]);
  });
});
