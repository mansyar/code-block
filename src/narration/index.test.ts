import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createNarration } from './index';

const played: string[] = [];
const spoken: string[] = [];

class FakeAudio {
  src: string;

  constructor(src: string) {
    this.src = src;
  }

  play() {
    played.push(this.src);
    return Promise.resolve();
  }

  pause() {}
}

class FakeUtterance {
  text: string;
  lang = '';
  rate = 1;
  pitch = 1;

  constructor(text: string) {
    this.text = text;
  }
}

describe('createNarration', () => {
  beforeEach(() => {
    played.length = 0;
    spoken.length = 0;

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel: () => {},
        speak: (utterance: FakeUtterance) => spoken.push(utterance.text),
      },
    });
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
    vi.stubGlobal('Audio', FakeAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, 'speechSynthesis');
  });

  it('uses the device voice when the line has no rendered clip', () => {
    const narration = createNarration(() => undefined);

    narration.speak({ id: 'concept-order', text: 'You made it!' });

    expect(spoken).toEqual(['You made it!']);
    expect(played).toEqual([]);
  });

  it('plays the rendered clip instead of speaking when one exists', () => {
    const narration = createNarration(() => '/audio/concept-order.mp3');

    narration.speak({ id: 'concept-order', text: 'You made it!' });

    expect(played).toEqual(['/audio/concept-order.mp3']);
    expect(spoken).toEqual([]);
  });

  it('defaults to the empty manifest, so every line uses the device voice', () => {
    const narration = createNarration();

    narration.speak({ id: 'concept-order', text: 'You made it!' });

    expect(spoken).toEqual(['You made it!']);
    expect(played).toEqual([]);
  });
});
