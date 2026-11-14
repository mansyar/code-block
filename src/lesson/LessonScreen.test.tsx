import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ScriptLine } from '../content/lesson';
import { lessonOne } from '../content/lessons/0001-order';
import type { Narration } from '../narration/port';
import { LessonScreen } from './LessonScreen';

function fakeNarration() {
  return { speak: vi.fn<(line: ScriptLine) => void>(), stop: vi.fn<() => void>() };
}

function renderLesson(narration: Narration = fakeNarration()) {
  const onClose = vi.fn();
  const onComplete = vi.fn();

  render(
    <LessonScreen
      lesson={lessonOne}
      onClose={onClose}
      onComplete={onComplete}
      narration={narration}
    />,
  );

  return { narration, onClose, onComplete };
}

function playTheGame() {
  for (const step of lessonOne.game.solution) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(step, 'i') }));
  }
}

describe('LessonScreen', () => {
  it('names the lesson', () => {
    renderLesson();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(lessonOne.title);
  });

  it('shows the cards in their display order, which is not the solution', () => {
    renderLesson();

    const shown = screen.getAllByRole('listitem').map((card) => card.getAttribute('data-card'));

    expect(shown).toEqual([...lessonOne.game.cards]);
    expect(shown).not.toEqual([...lessonOne.game.solution]);
  });

  it('returns to the map from the back control', () => {
    const { onClose } = renderLesson();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens the concept beat when the game is finished, and speaks the line once', () => {
    const narration = fakeNarration();
    renderLesson(narration);

    playTheGame();

    expect(narration.speak).toHaveBeenCalledTimes(1);
    expect(narration.speak).toHaveBeenCalledWith(lessonOne.concept);
    expect(screen.getByText(lessonOne.concept.text)).toBeInTheDocument();
  });

  it('shows the finished picture in the order the cards were placed', () => {
    renderLesson();

    playTheGame();

    const finished = screen
      .getAllByRole('listitem')
      .map((card) => card.getAttribute('data-finished-card'));

    expect(finished).toEqual([...lessonOne.game.solution]);
  });

  it('speaks the line again when replay is used', () => {
    const narration = fakeNarration();
    renderLesson(narration);

    playTheGame();
    fireEvent.click(screen.getByRole('button', { name: /play it again/i }));

    expect(narration.speak).toHaveBeenCalledTimes(2);
  });

  it('still shows the concept when the voice fails', () => {
    const broken: Narration = {
      speak: () => {
        throw new Error('no voice on this tablet');
      },
      stop: () => {},
    };

    renderLesson(broken);
    playTheGame();

    expect(screen.getByText(lessonOne.concept.text)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play it again/i })).toBeInTheDocument();
  });

  it('finishes the lesson from the done control', () => {
    const { onComplete } = renderLesson();

    playTheGame();
    fireEvent.click(screen.getByRole('button', { name: /done/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('stops speaking when the lesson closes', () => {
    const narration = fakeNarration();
    const { unmount } = render(
      <LessonScreen
        lesson={lessonOne}
        onClose={vi.fn()}
        onComplete={vi.fn()}
        narration={narration}
      />,
    );

    unmount();

    expect(narration.stop).toHaveBeenCalled();
  });
});
