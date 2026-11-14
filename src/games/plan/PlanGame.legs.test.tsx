import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lesson } from '../../content/lesson';
import { FLAG_BEAT_MS, STEP_MS } from '../../world/walk';
import { PlanGame } from './PlanGame';

/**
 * The two-leg half of the plan game: the handover at flag 1, the finish at flag 2, and a second leg
 * that cannot be won by repeating the first one. Kept out of `PlanGame.test.tsx` because structure
 * rule 2 caps a file at 200 lines.
 */

const planLesson: Lesson = {
  id: 'cause',
  title: 'Make it move',
  order: 3,
  game: {
    gameKind: 'plan',
    cards: ['step-up', 'step-right'],
    solution: ['step-up', 'step-right', 'step-right', 'step-up'],
    flags: [2, 4],
  },
  concept: { id: 'concept-cause', text: 'You said go, and it went.' },
};

function renderGame() {
  const onComplete = vi.fn();
  const { container, unmount } = render(<PlanGame lesson={planLesson} onComplete={onComplete} />);

  return {
    container,
    unmount,
    onComplete,
    palette: (card: string) => screen.getByRole('button', { name: new RegExp(`^${card}$`, 'i') }),
    go: () => screen.getByRole('button', { name: /^go$/i }),
    paletteLive: () => !screen.getByRole('button', { name: /^step-up$/i }).hasAttribute('disabled'),
    waving: () =>
      Number(container.querySelector('[data-wave="true"]')?.getAttribute('data-cell') ?? -1),
    walker: () =>
      Number(container.querySelector('[data-walker="true"]')?.getAttribute('data-cell') ?? -1),
    planned: () =>
      Array.from(container.querySelectorAll('[data-step]')).map((cell) =>
        cell.getAttribute('data-step'),
      ),
    walk: (ms: number) =>
      act(() => {
        vi.advanceTimersByTime(ms);
      }),
  };
}

type Game = ReturnType<typeof renderGame>;

/** Leg 1 is up, right — the two arrows that reach flag 1. */
function playFirstLeg(game: Game) {
  fireEvent.click(game.palette('step-up'));
  fireEvent.click(game.palette('step-right'));
  fireEvent.click(game.go());
  game.walk(STEP_MS * 2);
}

describe('PlanGame — two legs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('acknowledges flag 1 with a beat, then hands him a fresh plan there', () => {
    const g = renderGame();

    playFirstLeg(g);

    expect(g.walker()).toBe(2);
    expect(g.onComplete).not.toHaveBeenCalled();
    expect(g.container.querySelectorAll('[data-goal="true"]')).toHaveLength(2);

    // The beat: the flag he reached waves, the plan still stands, the palette waits (FR-7).
    expect(g.waving()).toBe(2);
    expect(g.planned()).toEqual(['step-up', 'step-right', 'none', 'none', 'none']);
    expect(g.paletteLive()).toBe(false);

    g.walk(FLAG_BEAT_MS);

    // Then the plan is spent, the palette is his again, and the walker has not moved.
    expect(g.waving()).toBe(-1);
    expect(g.walker()).toBe(2);
    expect(g.planned()).toEqual(['none', 'none', 'none', 'none', 'none']);
    expect(g.paletteLive()).toBe(true);

    // The next plan is written from the flag, not from the start.
    fireEvent.click(g.palette('step-right'));
    expect(g.planned()[2]).toBe('step-right');
    expect(g.planned()[0]).toBe('none');
  });

  it('finishes at the last flag and reports completion exactly once', () => {
    const g = renderGame();

    playFirstLeg(g);
    g.walk(FLAG_BEAT_MS);
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.go());
    g.walk(STEP_MS * 2);

    expect(g.walker()).toBe(4);
    expect(g.onComplete).toHaveBeenCalledTimes(1);

    g.walk(STEP_MS * 10);

    expect(g.onComplete).toHaveBeenCalledTimes(1);
    expect(g.walker()).toBe(4);
  });

  it('will not let the first leg’s plan win the second: it halts at the flag', () => {
    const g = renderGame();

    playFirstLeg(g);
    g.walk(FLAG_BEAT_MS);

    // The clever mistake: press the same two arrows again. From flag 1 the road goes right, not up.
    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.go());
    g.walk(STEP_MS);

    expect(g.walker()).toBe(2);
    expect(g.onComplete).not.toHaveBeenCalled();
    expect(g.container.querySelector('[data-stuck="true"]')).not.toBeNull();
  });

  it('cancels its timers when the lesson closes mid-run', () => {
    const g = renderGame();

    playFirstLeg(g);
    g.walk(FLAG_BEAT_MS);
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.go());
    g.walk(STEP_MS);

    g.unmount();
    g.walk(STEP_MS * 10);

    expect(g.onComplete).not.toHaveBeenCalled();
  });
});
