import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { curriculum, findLesson, firstLesson } from './content/lessons/index';
import { PROGRESS_KEY } from './progress/schema';

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
  fireEvent.click(screen.getByRole('button', { name: /^done$/i }));
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('opens on the journey map with every node and no lesson screen', () => {
    render(<App />);

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.queryByRole('heading', { level: 1, name: firstLesson.title })).toBeNull();
  });

  it('opens lesson 1 from its node, showing its cards in display order', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));

    const lesson = findLesson(firstLesson.id);
    expect(lesson).toBeDefined();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(firstLesson.title);

    const shown = screen.getAllByRole('listitem').map((card) => card.getAttribute('data-card'));
    expect(shown).toEqual([...(lesson?.game.cards ?? [])]);
  });

  it('goes back to the map from the lesson screen', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your path');
  });

  it('gives lesson 1 a star and opens lesson 2 once the lesson is finished', () => {
    render(<App />);

    playLessonOne();

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.getByRole('button', { name: /lesson 1.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 2/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /lesson 3/i })).toBeDisabled();
  });

  it('keeps the star when the child leaves by the back control instead of done', () => {
    render(<App />);

    solveLessonOne();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByRole('button', { name: /lesson 1.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 2/i })).toBeEnabled();
  });

  it('keeps the star and the open stop across a remount', () => {
    const first = render(<App />);
    playLessonOne();
    first.unmount();

    render(<App />);

    expect(screen.getByRole('button', { name: /lesson 1.*done/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lesson 2/i })).toBeEnabled();
  });

  it('writes the star once, even if the lesson is finished again', () => {
    render(<App />);
    playLessonOne();

    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null') as {
      completed: string[];
    };

    expect(saved.completed).toEqual([firstLesson.id]);
  });

  it('reopens a finished lesson with its cards fresh', () => {
    render(<App />);
    playLessonOne();

    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText(/you made it/i)).toBeNull();
    expect(screen.getByRole('button', { name: /bread/i })).toBeInTheDocument();
  });

  it('starts fresh from an unparseable saved profile and still shows the map', () => {
    window.localStorage.setItem(PROGRESS_KEY, '"{"');

    render(<App />);

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.queryByRole('button', { name: /lesson 1.*done/i })).toBeNull();
    expect(screen.getByRole('button', { name: /lesson 2/i })).toBeDisabled();
  });

  it('starts fresh from a saved profile of an unknown version', () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ version: 99, completed: [firstLesson.id], current: 'repeat' }),
    );

    render(<App />);

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.queryByRole('button', { name: /lesson 1.*done/i })).toBeNull();
  });
});
