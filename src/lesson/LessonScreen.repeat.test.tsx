import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ScriptLine } from '../content/lesson';
import { lessonTwo } from '../content/lessons/0002-repeat';
import type { Narration } from '../narration/port';
import { CELEBRATE_MS, STEP_MS } from '../world/walk';
import { LessonScreen } from './LessonScreen';

function fakeNarration() {
  return { speak: vi.fn<(line: ScriptLine) => void>(), stop: vi.fn<() => void>() };
}

function renderLesson(narration: Narration = fakeNarration()) {
  const { container } = render(
    <LessonScreen
      lesson={lessonTwo}
      onClose={vi.fn()}
      onComplete={vi.fn()}
      narration={narration}
    />,
  );

  return { container, narration };
}

/** One tap, the three timed steps the repeat game owns, then the arrival celebration. */
function playTheGame() {
  fireEvent.click(screen.getByRole('button', { name: /^go$/i }));
  act(() => {
    vi.advanceTimersByTime(STEP_MS * 3);
  });
  // The celebration timer is scheduled once the arrival has rendered, so it needs its own tick.
  act(() => {
    vi.advanceTimersByTime(CELEBRATE_MS);
  });
}

describe('LessonScreen — lesson 2', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('names the lesson and shows one card', () => {
    renderLesson();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(lessonTwo.title);
    expect(screen.getAllByRole('button', { name: /^go$/i })).toHaveLength(1);
  });

  it('speaks its concept line exactly once when the walk finishes, and again on replay', () => {
    const { narration } = renderLesson();

    playTheGame();

    expect(narration.speak).toHaveBeenCalledTimes(1);
    expect(narration.speak).toHaveBeenCalledWith(lessonTwo.concept);

    fireEvent.click(screen.getByRole('button', { name: /play it again/i }));

    expect(narration.speak).toHaveBeenCalledTimes(2);
  });

  it('prints the title and the concept line, and no sprite id anywhere (FR-7)', () => {
    const { container } = renderLesson();

    expect(container.textContent).not.toMatch(/step-|walker/);

    playTheGame();

    // Everything left after removing the title and the concept line must be the back arrow, so no
    // other word — instruction, id or hint — is on screen.
    const rest = (container.textContent ?? '')
      .replace(lessonTwo.title, '')
      .replace(lessonTwo.concept.text, '');

    expect(rest).toBe('←');
    expect(container.textContent).not.toMatch(/step-|walker/);
  });
});
