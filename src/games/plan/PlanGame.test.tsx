import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lesson } from '../../content/lesson';
import { FLAG_BEAT_MS, STEP_MS } from '../../world/walk';
import { REFUSED_FLASH_MS } from '../palette';
import { PlanGame } from './PlanGame';

/** Lesson 3 as the content file will declare it: two arrows, four steps, two legs (D3). */
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
    plannedStep: (card: string) =>
      screen.getByRole('button', { name: new RegExp(`^${card}, planned$`, 'i') }),
    go: () => screen.getByRole('button', { name: /^go$/i }),
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

describe('PlanGame — planning', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the whole road with a flag at each leg and starts him at the beginning', () => {
    const { container, walker, planned } = renderGame();

    expect(container.querySelectorAll('[data-cell]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-goal="true"]')).toHaveLength(2);
    expect(walker()).toBe(0);
    expect(planned()).toEqual(['none', 'none', 'none', 'none', 'none']);
  });

  it('plans a leg of two steps and refuses to plan past the flag', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.palette('step-up'));

    expect(g.planned()).toEqual(['step-up', 'step-right', 'none', 'none', 'none']);
  });

  it('answers a tap on a full palette, and adds nothing to the plan', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.palette('step-right'));

    // The leg is full, so the tap cannot add — but the arrow he pressed says so for a beat.
    expect(g.palette('step-right')).toHaveAttribute('data-full', 'true');
    expect(g.palette('step-right')).toHaveAttribute('data-refused', 'true');
    expect(g.palette('step-up')).toHaveAttribute('data-refused', 'false');
    expect(g.planned()).toEqual(['step-up', 'step-right', 'none', 'none', 'none']);

    g.walk(REFUSED_FLASH_MS);

    expect(g.palette('step-right')).toHaveAttribute('data-refused', 'false');
    expect(g.planned()).toEqual(['step-up', 'step-right', 'none', 'none', 'none']);
  });

  it('takes a planned step back, and every step after it', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.plannedStep('step-up'));

    expect(g.planned()).toEqual(['none', 'none', 'none', 'none', 'none']);
  });

  it('moves nothing until GO is pressed', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    g.walk(STEP_MS * 5);

    expect(g.walker()).toBe(0);
  });

  it('does nothing on GO with an empty plan, and does not scold him for it', () => {
    const g = renderGame();

    fireEvent.click(g.go());
    g.walk(STEP_MS * 3);

    expect(g.go()).toBeEnabled();
    expect(g.walker()).toBe(0);
    expect(g.onComplete).not.toHaveBeenCalled();
  });

  it('walks the first leg on one press, without reporting completion', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.go());

    expect(g.walker()).toBe(0);
    g.walk(STEP_MS);
    expect(g.walker()).toBe(1);
    g.walk(STEP_MS);

    expect(g.walker()).toBe(2);
    expect(g.onComplete).not.toHaveBeenCalled();
    // The plan is held through the flag's beat...
    expect(g.planned()).toEqual(['step-up', 'step-right', 'none', 'none', 'none']);

    g.walk(FLAG_BEAT_MS);

    // ...and then the plan is spent; the walker is not.
    expect(g.planned()).toEqual(['none', 'none', 'none', 'none', 'none']);
    expect(g.walker()).toBe(2);
  });

  it('ignores a second press while a run is in flight', () => {
    const g = renderGame();

    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.go());
    g.walk(STEP_MS);
    fireEvent.click(g.go());
    g.walk(STEP_MS * 4);

    expect(g.walker()).toBe(2);
    expect(g.onComplete).not.toHaveBeenCalled();
  });

  it('halts where the road stops, keeping the plan so he can change it', () => {
    const g = renderGame();

    // Right is off this road: the first cell turns up.
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.go());
    g.walk(STEP_MS);

    expect(g.walker()).toBe(0);
    expect(g.onComplete).not.toHaveBeenCalled();
    expect(g.planned()[0]).toBe('step-right');
    expect(g.container.querySelector('[data-stuck="true"]')).not.toBeNull();

    // Still editable: adding the missing step and pressing again is all it takes.
    fireEvent.click(g.plannedStep('step-right'));
    fireEvent.click(g.palette('step-up'));
    fireEvent.click(g.palette('step-right'));
    fireEvent.click(g.go());
    g.walk(STEP_MS * 2);

    expect(g.walker()).toBe(2);
  });

  it('prints no words at all — the arrows and GO are the whole instruction', () => {
    const { container, walk } = renderGame();

    expect(container.textContent).toBe('');
    walk(STEP_MS);
    expect(container.textContent).toBe('');
  });
});
