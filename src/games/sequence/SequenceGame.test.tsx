import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { lessonOne } from '../../content/lessons/0001-order';
import { routeFor } from '../../world/path';
import { SequenceGame } from './SequenceGame';

function renderGame() {
  const onComplete = vi.fn();
  const { container } = render(<SequenceGame lesson={lessonOne} onComplete={onComplete} />);

  return {
    onComplete,
    container,
    card: (name: string) => screen.getByRole('button', { name: new RegExp(name, 'i') }),
    tray: () => within(screen.getByRole('list', { name: /cards to tap/i })),
    /** Which cell the walker stands in, or -1 if he is drawn nowhere. */
    walkerCell: () => {
      const cell = container.querySelector('[data-walker="true"]');

      return cell === null ? -1 : Number(cell.getAttribute('data-cell'));
    },
    /** The steps shown on the path, in cell order. */
    placedSteps: () =>
      Array.from(container.querySelectorAll('[data-step]'))
        .map((cell) => cell.getAttribute('data-step'))
        .filter((step) => step !== 'none'),
  };
}

describe('SequenceGame', () => {
  it('shows one tappable card per lesson card, in the display order', () => {
    const { tray } = renderGame();

    const cards = tray()
      .getAllByRole('button')
      .map((button) => button.closest('li')?.getAttribute('data-card'));

    expect(cards).toEqual([...lessonOne.game.cards]);
  });

  it('draws one cell per step plus the start, and begins with the walker on the start', () => {
    const { container, walkerCell, placedSteps } = renderGame();

    expect(container.querySelectorAll('[data-cell]')).toHaveLength(routeFor(lessonOne).length);
    expect(routeFor(lessonOne)).toHaveLength(lessonOne.game.solution.length + 1);
    expect(walkerCell()).toBe(0);
    expect(placedSteps()).toEqual([]);
  });

  it('puts each cell where its arrow points: up, then right, then down', () => {
    const { container } = renderGame();

    expect(routeFor(lessonOne)).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: -1 },
      { col: 1, row: -1 },
      { col: 1, row: 0 },
    ]);

    const coords = Array.from(container.querySelectorAll('[data-cell]')).map((cell) => [
      cell.getAttribute('data-col'),
      cell.getAttribute('data-row'),
    ]);

    expect(coords).toEqual([
      ['0', '0'],
      ['0', '-1'],
      ['1', '-1'],
      ['1', '0'],
    ]);
  });

  it('shows the whole road and a goal at its end before the child taps anything', () => {
    const { container } = renderGame();

    const goals = container.querySelectorAll('[data-goal="true"]');
    expect(goals).toHaveLength(1);
    expect(goals[0]).toHaveAttribute('data-cell', String(lessonOne.game.solution.length));
  });

  it('walks him onto the goal cell, and only by the direction of each arrow', () => {
    const { card, walkerCell, container, onComplete } = renderGame();

    for (const step of lessonOne.game.solution) {
      fireEvent.click(card(step));

      expect(container.querySelector('[data-walker="true"]')?.getAttribute('data-col')).toBe(
        String(routeFor(lessonOne)[walkerCell()]?.col),
      );
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-goal="true"]')).toHaveAttribute('data-walker', 'true');
  });

  it('moves the walker exactly one cell for each correct tap', () => {
    const { card, walkerCell } = renderGame();

    for (const [index, step] of lessonOne.game.solution.entries()) {
      fireEvent.click(card(step));

      expect(walkerCell()).toBe(index + 1);
    }
  });

  it('completes once when the cards are tapped in the solution order', () => {
    const { card, walkerCell, placedSteps, onComplete } = renderGame();

    for (const step of lessonOne.game.solution) {
      fireEvent.click(card(step));
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(walkerCell()).toBe(lessonOne.game.solution.length);
    expect(placedSteps()).toEqual([...lessonOne.game.solution]);
  });

  it('wobbles a wrong card and advances nothing', () => {
    const { card, walkerCell, placedSteps, onComplete } = renderGame();

    const wrongStep = lessonOne.game.solution[1] as string;
    fireEvent.click(card(wrongStep));

    expect(card(wrongStep)).toHaveAttribute('data-wrong', 'true');
    expect(card(wrongStep)).toHaveAttribute('data-placed', 'false');
    expect(walkerCell()).toBe(0);
    expect(placedSteps()).toEqual([]);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('keeps a placed card placed and refuses a second tap', () => {
    const { card, walkerCell, onComplete } = renderGame();

    const first = lessonOne.game.solution[0] as string;
    fireEvent.click(card(first));

    const placedCard = card(first);
    expect(placedCard).toBeDisabled();
    expect(placedCard).toHaveAttribute('data-placed', 'true');
    expect(placedCard).toHaveAccessibleName(new RegExp(`${first}, placed`, 'i'));

    fireEvent.click(placedCard);

    expect(walkerCell()).toBe(1);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete twice when the last card is tapped again', () => {
    const { card, onComplete } = renderGame();

    for (const step of lessonOne.game.solution) {
      fireEvent.click(card(step));
    }

    const last = lessonOne.game.solution.at(-1) as string;
    fireEvent.click(card(last));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('makes every card a real button, so the shared tap-target rule applies', () => {
    const { tray } = renderGame();

    // jsdom applies no stylesheet and Vitest stubs CSS, so the size itself is not measurable
    // here; the built stylesheet is checked for the token instead (see phase-3 evidence).
    const buttons = tray().getAllByRole('button');

    expect(buttons).toHaveLength(lessonOne.game.cards.length);
    for (const button of buttons) {
      expect(button.tagName).toBe('BUTTON');
    }
  });
});
