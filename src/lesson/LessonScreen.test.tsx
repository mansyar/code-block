import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { lessonOne } from '../content/lessons/0001-order';
import { LessonScreen } from './LessonScreen';

describe('LessonScreen', () => {
  it('names the lesson', () => {
    render(<LessonScreen lesson={lessonOne} onClose={vi.fn()} onComplete={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(lessonOne.title);
  });

  it('shows the cards in their display order, which is not the solution', () => {
    render(<LessonScreen lesson={lessonOne} onClose={vi.fn()} onComplete={vi.fn()} />);

    const shown = screen.getAllByRole('listitem').map((card) => card.getAttribute('data-card'));

    expect(shown).toEqual([...lessonOne.game.cards]);
    expect(shown).not.toEqual([...lessonOne.game.solution]);
  });

  it('returns to the map from the back control', () => {
    const onClose = vi.fn();
    render(<LessonScreen lesson={lessonOne} onClose={onClose} onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
