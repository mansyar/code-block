import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { curriculum, findLesson, firstLesson } from './content/lessons/index';

describe('App', () => {
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
});
