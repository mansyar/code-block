import { describe, expect, it } from 'vitest';
import type { Lesson } from '../content/lesson';
import { lessonOne } from '../content/lessons/0001-order';
import { isStep, repeatRoute, routeFor, tracePath } from './path';

describe('the world grid', () => {
  it('moves one cell in the direction each arrow points', () => {
    expect(tracePath(['step-up'])).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: -1 },
    ]);
    expect(tracePath(['step-right'])).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
    ]);
    expect(tracePath(['step-down'])).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: 1 },
    ]);
  });

  it('builds lesson 1 a road that really goes up, right, then down', () => {
    expect(routeFor(lessonOne)).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: -1 },
      { col: 1, row: -1 },
      { col: 1, row: 0 },
    ]);
  });

  it('starts and ends lesson 1 on the same row, so an up/down mix-up is visible', () => {
    const route = routeFor(lessonOne);
    const start = route[0];
    const end = route[route.length - 1];

    expect(start?.row).toBe(end?.row);
    expect(start?.col).not.toBe(end?.col);
  });

  it('runs a repeated step the same number of cells in its own direction', () => {
    expect(repeatRoute('step-right', 3)).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 3, row: 0 },
    ]);
  });

  it('refuses a walker as a route step, because he is the actor not a direction', () => {
    const broken: Lesson = {
      ...lessonOne,
      game: { ...lessonOne.game, solution: ['walker', 'step-right', 'step-down'] },
    };

    expect(isStep('walker')).toBe(false);
    expect(() => routeFor(broken)).toThrow(/route step cannot be the walker/);
  });
});
