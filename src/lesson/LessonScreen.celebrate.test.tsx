import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ScriptLine } from '../content/lesson';
import { lessonOne } from '../content/lessons/0001-order';
import type { Narration } from '../narration/port';
import { CELEBRATE_MS } from '../world/walk';
import { LessonScreen } from './LessonScreen';

/**
 * The beat between finishing the walk and hearing the concept: the road celebrates the arrival
 * before the screen changes. Kept out of `LessonScreen.test.tsx` because structure rule 2 caps a
 * file at 200 lines.
 */

function fakeNarration(): Narration {
  return { speak: vi.fn<(line: ScriptLine) => void>(), stop: vi.fn<() => void>() };
}

function renderLesson(narration: Narration = fakeNarration()) {
  const onComplete = vi.fn();
  const onClose = vi.fn();
  const { container } = render(
    <LessonScreen
      lesson={lessonOne}
      onClose={onClose}
      onComplete={onComplete}
      narration={narration}
    />,
  );

  return { container, onComplete, onClose };
}

function playTheGame() {
  for (const step of lessonOne.game.solution) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(step, 'i') }));
  }
}

/** The celebration is its own beat, so it needs its own tick of the clock. */
function arrive() {
  act(() => {
    vi.advanceTimersByTime(CELEBRATE_MS);
  });
}

describe('LessonScreen — the arrival', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('celebrates the arrival before the concept beat opens, earning the star on arrival', () => {
    const { container, onComplete } = renderLesson();

    playTheGame();

    // The star is his the moment he arrives...
    expect(onComplete).toHaveBeenCalledTimes(1);
    // ...and the screen is still the road, celebrating, with no concept text on it yet.
    expect(container.querySelector('[data-celebrate="true"]')).not.toBeNull();
    expect(screen.queryByText(lessonOne.concept.text)).not.toBeInTheDocument();

    arrive();

    expect(container.querySelector('[data-celebrate="true"]')).toBeNull();
    expect(screen.getByText(lessonOne.concept.text)).toBeInTheDocument();
  });

  it('does not speak the concept line until the celebration is over', () => {
    const narration = fakeNarration();
    renderLesson(narration);

    playTheGame();
    expect(narration.speak).not.toHaveBeenCalled();

    arrive();

    expect(narration.speak).toHaveBeenCalledTimes(1);
    expect(narration.speak).toHaveBeenCalledWith(lessonOne.concept);
  });

  it('keeps the star when the child leaves during the celebration', () => {
    const { onComplete, onClose } = renderLesson();

    playTheGame();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
