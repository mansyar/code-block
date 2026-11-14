import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { findLesson, firstLesson } from './content/lessons/index';
import { PROGRESS_KEY } from './progress/schema';
import { CELEBRATE_MS, FLAG_BEAT_MS, STEP_MS } from './world/walk';

/**
 * The fourth stop, played through the real app: four arrows, one pad, its own star and the stop it
 * opens. Kept out of `App.test.tsx` because structure rule 2 caps a file at 200 lines.
 */

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

function walkerCell() {
  return Number(document.querySelector('[data-walker="true"]')?.getAttribute('data-cell') ?? -1);
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

/** Plan lesson 4's four arrows and press GO, stopping on the arrival frame. */
function playLessonFour() {
  openLesson(4);

  for (const step of content('condition').game.solution) {
    tap(step);
  }

  fireEvent.click(screen.getByRole('button', { name: GO }));
}

function playThroughToLessonFour() {
  render(<App />);
  playLessonOne();
  playLessonTwo();
  playLessonThree();
}

describe('App — lesson 4', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('draws one pad on a six-cell road, and the padded step takes two beats', () => {
    playThroughToLessonFour();

    openLesson(4);

    expect(document.querySelectorAll('[data-pad="red"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-cell]')).toHaveLength(6);

    for (const step of content('condition').game.solution) {
      tap(step);
    }

    fireEvent.click(screen.getByRole('button', { name: GO }));

    advance(STEP_MS);
    expect(walkerCell()).toBe(1);
    advance(STEP_MS);
    expect(walkerCell()).toBe(2);
    advance(STEP_MS);
    // The pad's arrow, not two arrows: the plan had two steps behind him by now otherwise.
    expect(walkerCell()).toBe(3);
    advance(STEP_MS * 2);
    expect(walkerCell()).toBe(5);
  });

  it('celebrates the arrival before the concept speaks', () => {
    playThroughToLessonFour();
    playLessonFour();

    advance(STEP_MS * 6);

    expect(screen.queryByText(content('condition').concept.text)).not.toBeInTheDocument();

    advance(CELEBRATE_MS);
    expect(screen.getByText(content('condition').concept.text)).toBeInTheDocument();
  });

  it('earns lesson 4 its star and opens lesson 5', () => {
    playThroughToLessonFour();
    playLessonFour();
    advance(STEP_MS * 6);
    advance(CELEBRATE_MS);
    fireEvent.click(screen.getByRole('button', { name: DONE }));

    expect(screen.getByRole('button', { name: /lesson 4.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 5/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /lesson 6/i })).toBeDisabled();
  });

  it('prints nothing: the screen says only where to go back and what it is called', () => {
    playThroughToLessonFour();
    openLesson(4);

    const lesson = document.querySelector('section[aria-labelledby="lesson-title"]');
    const text = (lesson?.textContent ?? '').replace(/\s+/g, ' ').trim();

    // The back arrow and the title are the whole screen: no sprite id, no instruction, no label.
    expect(text).toBe('←If it is red');
    expect(text).not.toMatch(/step-|walker|go\b/i);
    // The back control's arrow is the only other mark, and it is decorative.
    expect(lesson?.querySelector('[aria-hidden="true"]')?.textContent).toBe('←');
  });

  it('stores four completed lessons under the unchanged key', () => {
    playThroughToLessonFour();
    playLessonFour();
    advance(STEP_MS * 6);
    advance(CELEBRATE_MS);

    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null') as {
      version: number;
      completed: string[];
    };

    expect(saved.version).toBe(1);
    expect(saved.completed).toEqual(['order', 'repeat', 'cause', 'condition']);
  });
});
