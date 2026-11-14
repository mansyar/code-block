import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { lessonOne } from '../../content/lessons/0001-order';
import { SequenceGame } from './SequenceGame';

function renderGame() {
  const onComplete = vi.fn();

  render(<SequenceGame lesson={lessonOne} onComplete={onComplete} />);

  return {
    onComplete,
    card: (name: string) => screen.getByRole('button', { name: new RegExp(name, 'i') }),
    tray: () => within(screen.getByRole('list', { name: /cards to tap/i })),
    plate: () => within(screen.getByRole('list', { name: /placed cards/i })),
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

  it('completes once when the cards are tapped in the solution order', () => {
    const { card, plate, onComplete } = renderGame();

    for (const step of lessonOne.game.solution) {
      fireEvent.click(card(step));
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(plate().getAllByRole('listitem')).toHaveLength(lessonOne.game.solution.length);
  });

  it('wobbles a wrong card and advances nothing', () => {
    const { card, plate, onComplete } = renderGame();

    const wrongStep = lessonOne.game.solution[1] as string;
    fireEvent.click(card(wrongStep));

    expect(card(wrongStep)).toHaveAttribute('data-wrong', 'true');
    expect(card(wrongStep)).toHaveAttribute('data-placed', 'false');
    expect(plate().queryAllByRole('listitem')).toHaveLength(0);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('keeps a placed card placed and refuses a second tap', () => {
    const { card, plate, onComplete } = renderGame();

    const first = lessonOne.game.solution[0] as string;
    fireEvent.click(card(first));

    const placedCard = card(first);
    expect(placedCard).toBeDisabled();
    expect(placedCard).toHaveAttribute('data-placed', 'true');
    expect(placedCard).toHaveAccessibleName(new RegExp(`${first}, placed`, 'i'));

    fireEvent.click(placedCard);

    expect(plate().getAllByRole('listitem')).toHaveLength(1);
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
