import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { assertLesson, type Lesson } from '../../content/lesson';
import { lessonTwo } from '../../content/lessons/0002-repeat';
import { STEP_MS } from '../../world/walk';
import { RepeatGame } from '../repeat/RepeatGame';
import { ConditionGame } from './ConditionGame';

/**
 * Lesson 4's shape, as a fixture: right, up twice, right, right — six cells, one pad at cell 3.
 * The real lesson file arrives in phase 3; this asserts the game, not the content.
 */
const lesson: Lesson = assertLesson({
  id: 'condition',
  title: 'If it is red',
  order: 4,
  game: {
    gameKind: 'condition',
    cards: ['step-up', 'step-right'],
    solution: ['step-right', 'step-up', 'step-right', 'step-right'],
    twice: [2],
  },
  concept: { id: 'concept-condition', text: 'It was red, so it went again.' },
});

function tap(step: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${step}$`) }));
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function walkerCell() {
  return Number(document.querySelector('[data-walker="true"]')?.getAttribute('data-cell') ?? -1);
}

function padCells() {
  return Array.from(document.querySelectorAll('[data-pad="red"]')).map((cell) =>
    Number(cell.getAttribute('data-cell')),
  );
}

function plan(...steps: string[]) {
  for (const step of steps) {
    tap(step);
  }
}

describe('the condition game', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks the tile a repeat happens on, with a shape of its own', () => {
    render(<ConditionGame lesson={lesson} onComplete={vi.fn()} />);

    expect(padCells()).toEqual([3]);
    expect(document.querySelectorAll('[data-repeat="true"]')).toHaveLength(1);
  });

  it('draws no pad at all for a lesson that names no repeat', () => {
    render(<RepeatGame lesson={lessonTwo} onComplete={vi.fn()} />);

    expect(document.querySelectorAll('[data-pad="red"]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-repeat="true"]')).toHaveLength(0);
  });

  it('walks two cells for the padded arrow and one for every other', () => {
    const onComplete = vi.fn();
    render(<ConditionGame lesson={lesson} onComplete={onComplete} />);
    plan('step-right', 'step-up', 'step-right', 'step-right');

    fireEvent.click(screen.getByRole('button', { name: /^go$/i }));

    advance(STEP_MS);
    expect(walkerCell()).toBe(1);

    // The second arrow is the pad's: two cells, two beats.
    advance(STEP_MS);
    expect(walkerCell()).toBe(2);
    advance(STEP_MS);
    expect(walkerCell()).toBe(3);

    advance(STEP_MS * 2);
    expect(walkerCell()).toBe(5);
    expect(onComplete).toHaveBeenCalledTimes(1);

    advance(STEP_MS * 20);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('halts where the road stops, keeps the plan, and stays editable', () => {
    render(<ConditionGame lesson={lesson} onComplete={vi.fn()} />);
    plan('step-up');

    fireEvent.click(screen.getByRole('button', { name: /^go$/i }));
    advance(STEP_MS * 2);

    expect(walkerCell()).toBe(0);
    expect(document.querySelector('[data-stuck="true"]')).not.toBeNull();

    // Still editable: the plan was not cleared by the mistake.
    tap('step-right');
    expect(screen.getAllByRole('button', { name: /, planned$/ })).toHaveLength(2);
  });

  it('takes a planned arrow back, and everything planned after it', () => {
    render(<ConditionGame lesson={lesson} onComplete={vi.fn()} />);
    plan('step-right', 'step-up', 'step-right');

    // The second right arrow is the one on the pad's tile; taking it back leaves the two before it.
    const rights = screen.getAllByRole('button', { name: 'step-right, planned' });
    fireEvent.click(rights[rights.length - 1] as HTMLElement);

    expect(screen.getAllByRole('button', { name: /, planned$/ })).toHaveLength(2);
    expect(walkerCell()).toBe(0);
  });
});
