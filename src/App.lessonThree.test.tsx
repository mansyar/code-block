import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { findLesson, firstLesson } from './content/lessons/index';
import { PROGRESS_KEY } from './progress/schema';
import { CELEBRATE_MS, FLAG_BEAT_MS, STEP_MS } from './world/walk';

/**
 * The third stop, played through the real app: two legs, its own star, the stop it opens, and all
 * three stars surviving a reload. Kept out of `App.test.tsx` because structure rule 2 caps a file at
 * 200 lines.
 */

const ARROWS = /^(step-up|step-right)$/i;
const GO = /^go$/i;
const DONE = /^done$/i;

function openLesson(number: number) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`lesson ${number}`, 'i') }));
}

function content(id: string) {
  const lesson = findLesson(id);

  if (lesson === undefined) {
    throw new Error(`${id} has no content`);
  }

  return lesson;
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function tap(step: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${step}$`, 'i') }));
}

function playLessonOne() {
  openLesson(1);

  for (const card of content(firstLesson.id).game.solution) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(card, 'i') }));
  }

  advance(CELEBRATE_MS);
  fireEvent.click(screen.getByRole('button', { name: DONE }));
}

function playLessonTwo() {
  openLesson(2);
  fireEvent.click(screen.getByRole('button', { name: GO }));
  advance(STEP_MS * 3);
  advance(CELEBRATE_MS);
  fireEvent.click(screen.getByRole('button', { name: DONE }));
}

/** Plan a leg, press GO, let it arrive, and let its beat play out. */
function runLeg(steps: readonly string[]) {
  for (const step of steps) {
    tap(step);
  }

  fireEvent.click(screen.getByRole('button', { name: GO }));
  advance(STEP_MS * steps.length + FLAG_BEAT_MS);
}

function playLessonThree() {
  openLesson(3);
  runLeg(['step-up', 'step-right']);
  runLeg(['step-right', 'step-up']);
  advance(CELEBRATE_MS);
  fireEvent.click(screen.getByRole('button', { name: DONE }));
}

describe('App — lesson 3', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows lesson 3 as two flags on one road, with no star until the second leg', () => {
    render(<App />);

    playLessonOne();
    playLessonTwo();
    openLesson(3);

    const flags = () => document.querySelectorAll('[data-goal="true"]');
    const walkerCell = () =>
      Number(document.querySelector('[data-walker="true"]')?.getAttribute('data-cell') ?? -1);

    expect(flags()).toHaveLength(2);
    expect(walkerCell()).toBe(0);
    expect(
      screen.getAllByRole('button').filter((button) => ARROWS.test(button.ariaLabel ?? '')),
    ).toHaveLength(2);

    runLeg(['step-up', 'step-right']);

    // Halfway: he is on flag 1, the plan is spent, and no star has been written.
    expect(walkerCell()).toBe(2);
    expect(flags()).toHaveLength(2);
    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null') as {
      completed: string[];
    };
    expect(saved.completed).toEqual(['order', 'repeat']);
  });

  it('earns lesson 3 its own star and opens lesson 4', () => {
    render(<App />);

    playLessonOne();
    playLessonTwo();
    playLessonThree();

    expect(screen.getByRole('button', { name: /lesson 3.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 4/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /lesson 5/i })).toBeDisabled();
  });

  it('keeps three stars across a remount', () => {
    const first = render(<App />);
    playLessonOne();
    playLessonTwo();
    playLessonThree();
    first.unmount();

    render(<App />);

    for (const number of [1, 2, 3]) {
      expect(
        screen.getByRole('button', { name: new RegExp(`lesson ${number}.*done`, 'i') }),
      ).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /lesson 4/i })).toBeEnabled();
  });

  it('shows the plan it ran after the last flag, repeats and all', () => {
    render(<App />);

    playLessonOne();
    playLessonTwo();
    openLesson(3);
    runLeg(['step-up', 'step-right']);
    runLeg(['step-right', 'step-up']);
    advance(CELEBRATE_MS);

    expect(
      Array.from(document.querySelectorAll('[data-finished-card]')).map((card) =>
        card.getAttribute('data-finished-card'),
      ),
    ).toEqual(['step-up', 'step-right', 'step-right', 'step-up']);
    expect(screen.getByText(content('cause').concept.text)).toBeInTheDocument();
  });

  it('stores the three completed lessons under the unchanged key', () => {
    render(<App />);
    playLessonOne();
    playLessonTwo();
    playLessonThree();

    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null') as {
      version: number;
      completed: string[];
    };

    expect(saved.version).toBe(1);
    expect(saved.completed).toEqual(['order', 'repeat', 'cause']);
  });
});
