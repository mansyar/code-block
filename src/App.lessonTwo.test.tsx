import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { curriculum, findLesson, firstLesson } from './content/lessons/index';
import { PROGRESS_KEY } from './progress/schema';
import { CELEBRATE_MS, STEP_MS } from './world/walk';

/**
 * The second stop, played through the real app: its star, the stop it opens, and both surviving a
 * reload. Kept out of `App.test.tsx` because structure rule 2 caps a file at 200 lines.
 */

function solveLessonOne() {
  const lesson = findLesson(firstLesson.id);

  if (lesson === undefined) {
    throw new Error('lesson 1 has no content');
  }

  fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));

  for (const card of lesson.game.solution) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(card, 'i') }));
  }
}

function playLessonOne() {
  solveLessonOne();
  act(() => {
    vi.advanceTimersByTime(CELEBRATE_MS);
  });
  fireEvent.click(screen.getByRole('button', { name: /^done$/i }));
}

function openLesson(number: number) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`lesson ${number}`, 'i') }));
}

/** Lesson 2 is the repeat game: one tap, then three timed steps, then the concept beat. */
function playLessonTwo() {
  openLesson(2);
  fireEvent.click(screen.getByRole('button', { name: /^go$/i }));
  act(() => {
    vi.advanceTimersByTime(STEP_MS * 3);
  });
  act(() => {
    vi.advanceTimersByTime(CELEBRATE_MS);
  });
  fireEvent.click(screen.getByRole('button', { name: /^done$/i }));
}

describe('App — lesson 2', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('earns lesson 2 its own star and opens lesson 3', () => {
    render(<App />);

    playLessonOne();
    expect(screen.getByRole('button', { name: /lesson 2/i })).toBeEnabled();

    playLessonTwo();

    expect(screen.getByRole('button', { name: /lesson 1.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 2.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 3/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /lesson 4/i })).toBeDisabled();
  });

  it('keeps both stars and the open stop across a remount', () => {
    const first = render(<App />);
    playLessonOne();
    playLessonTwo();
    first.unmount();

    render(<App />);

    expect(screen.getByRole('button', { name: /lesson 1.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 2.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 3/i })).toBeEnabled();
  });

  it('stores both completed lessons under the unchanged key', () => {
    render(<App />);
    playLessonOne();
    playLessonTwo();

    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null') as {
      version: number;
      completed: string[];
    };

    expect(saved.version).toBe(1);
    expect(saved.completed).toEqual(['order', 'repeat']);
  });

  it('shows a locked stop as a lock shape, never as a printed instruction (FR-7)', () => {
    const { container } = render(<App />);

    // The map's whole visible text is its title and the six stop numbers: no sentence at all.
    expect(container.textContent).toBe(
      `Your path${curriculum.map((_, index) => index + 1).join('')}`,
    );
    expect(container.querySelectorAll('[data-marker="lock"]')).toHaveLength(curriculum.length - 1);
    expect(container.querySelectorAll('[data-state="locked"]')).toHaveLength(curriculum.length - 1);
  });
});
