import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { curriculum, firstLesson } from '../content/lessons/index';
import { freshProgress, PROGRESS_VERSION, type Progress } from '../progress/schema';
import { JourneyMap } from './JourneyMap';

function renderMap(progress: Progress = freshProgress(firstLesson.id), onOpen = vi.fn()) {
  render(<JourneyMap curriculum={curriculum} progress={progress} onOpen={onOpen} />);
  return onOpen;
}

describe('JourneyMap', () => {
  it('renders one node per curriculum entry', () => {
    renderMap();

    expect(screen.getAllByRole('listitem')).toHaveLength(curriculum.length);
    expect(screen.getAllByRole('button')).toHaveLength(curriculum.length);
  });

  it('opens the first node and locks the rest on a fresh profile', () => {
    renderMap();

    expect(screen.getByRole('button', { name: /lesson 1/i })).toBeEnabled();

    for (const node of screen.getAllByRole('button').slice(1)) {
      expect(node).toBeDisabled();
      expect(node).toHaveAttribute('aria-disabled', 'true');
    }
  });

  it('marks a locked node with a different shape than an open one', () => {
    renderMap();

    const open = screen.getByRole('button', { name: /lesson 1/i });
    const locked = screen.getByRole('button', { name: /lesson 2/i });

    expect(open.querySelector('[data-marker]')).toHaveAttribute('data-marker', 'play');
    expect(locked.querySelector('[data-marker]')).toHaveAttribute('data-marker', 'lock');
  });

  it('reports the lesson id when the first node is activated', () => {
    const onOpen = renderMap();

    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(firstLesson.id);
  });

  it('shows a star on a finished node and opens the next one', () => {
    renderMap({ version: PROGRESS_VERSION, completed: [firstLesson.id], current: 'repeat' });

    const done = screen.getByRole('button', { name: /lesson 1/i });
    const next = screen.getByRole('button', { name: /lesson 2/i });

    expect(done).toHaveAttribute('data-state', 'done');
    expect(done.querySelector('[data-marker]')).toHaveAttribute('data-marker', 'star');
    expect(next).toBeEnabled();
    expect(next.querySelector('[data-marker]')).toHaveAttribute('data-marker', 'play');
  });
});
