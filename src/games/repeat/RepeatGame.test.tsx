import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lesson } from '../../content/lesson';
import { STEP_MS } from '../../world/walk';
import { RepeatGame } from './RepeatGame';

/** The shape lesson 2 will have: one card, one step, told once. */
const repeatLesson: Lesson = {
  id: 'repeat',
  title: 'Do it again',
  order: 2,
  game: { gameKind: 'repeat', cards: ['step-right'], solution: ['step-right'] },
  concept: {
    id: 'concept-repeat',
    text: 'You said it once, and it hopped again and again. Three times!',
  },
};

const STEPS = 3;

function renderGame() {
  const onComplete = vi.fn();
  const { container } = render(<RepeatGame lesson={repeatLesson} onComplete={onComplete} />);

  return {
    onComplete,
    container,
    go: () => screen.getByRole('button', { name: /go/i }),
    walkerCell: () => {
      const cell = container.querySelector('[data-walker="true"]');

      return cell === null ? -1 : Number(cell.getAttribute('data-cell'));
    },
    placedSteps: () =>
      Array.from(container.querySelectorAll('[data-step]'))
        .map((cell) => cell.getAttribute('data-step'))
        .filter((step) => step !== 'none'),
    walk: (ms: number) =>
      act(() => {
        vi.advanceTimersByTime(ms);
      }),
  };
}

describe('RepeatGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows exactly one tappable card and starts the walker at the start', () => {
    const { go, container, walkerCell, placedSteps } = renderGame();

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(go()).toBeEnabled();
    expect(container.querySelectorAll('[data-cell]')).toHaveLength(STEPS + 1);
    expect(walkerCell()).toBe(0);
    expect(placedSteps()).toEqual([]);
  });

  it('prints no words at all — the arrow is the instruction', () => {
    const { container, walk, go } = renderGame();

    expect(container.textContent).toBe('');

    fireEvent.click(go());
    walk(STEP_MS * STEPS);

    // Still nothing: not before the tap, not during the walk, not after it (FR-7).
    expect(container.textContent).toBe('');
    expect(container.textContent).not.toMatch(/step-|walker|again and again/i);
  });

  it('walks three cells from one tap, and completes exactly once', () => {
    const { go, walkerCell, placedSteps, walk, onComplete } = renderGame();

    fireEvent.click(go());

    expect(walkerCell()).toBe(0);
    expect(onComplete).not.toHaveBeenCalled();

    for (let step = 1; step <= STEPS; step += 1) {
      walk(STEP_MS);
      expect(walkerCell()).toBe(step);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(placedSteps()).toEqual(Array.from({ length: STEPS }, () => 'step-right'));
  });

  it('ignores a second tap while he is already walking', () => {
    const { go, walkerCell, walk, onComplete } = renderGame();

    fireEvent.click(go());
    walk(STEP_MS);
    fireEvent.click(go());

    walk(STEP_MS * STEPS);

    expect(walkerCell()).toBe(STEPS);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('refuses a tap once the walk is finished', () => {
    const { go, walk, walkerCell, onComplete } = renderGame();

    fireEvent.click(go());
    walk(STEP_MS * STEPS);

    expect(go()).toBeDisabled();
    fireEvent.click(go());
    walk(STEP_MS * STEPS);

    expect(walkerCell()).toBe(STEPS);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('clears its timers when the lesson closes mid-walk', () => {
    const onComplete = vi.fn();
    const { unmount } = render(<RepeatGame lesson={repeatLesson} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    act(() => {
      vi.advanceTimersByTime(STEP_MS);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(STEP_MS * STEPS);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
