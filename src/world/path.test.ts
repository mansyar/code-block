import { describe, expect, it } from 'vitest';
import type { Lesson } from '../content/lesson';
import { lessonOne } from '../content/lessons/0001-order';
import { lessons } from '../content/lessons/index';
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

  it('leaves every lesson that names no repeat with one cell per step', () => {
    const plain = lessons.filter((lesson) => lesson.game.twice === undefined);

    expect(plain.length).toBeGreaterThan(0);

    for (const lesson of plain) {
      expect(routeFor(lesson), `${lesson.id} lost a cell`).toHaveLength(
        lesson.game.solution.length + 1,
      );
    }
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

describe('a step the road takes twice', () => {
  /** Lesson 4's shape: right, up twice, right, right. */
  const road: Lesson = {
    ...lessonOne,
    game: {
      gameKind: 'condition',
      cards: ['step-up', 'step-right'],
      solution: ['step-right', 'step-up', 'step-right', 'step-right'],
      twice: [2],
    },
  };

  it('grows the route by one cell for every repeated step', () => {
    expect(road.game.solution).toHaveLength(4);
    expect(routeFor(road)).toHaveLength(4 + 1 + 1);
  });

  it("puts the extra cell one step further in that arrow's own direction", () => {
    expect(routeFor(road)).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 1, row: -1 },
      { col: 1, row: -2 },
      { col: 2, row: -2 },
      { col: 3, row: -2 },
    ]);
  });

  it('repeats two adjacent steps on one arrow without merging them', () => {
    const doubled: Lesson = {
      ...lessonOne,
      game: { ...road.game, solution: ['step-right', 'step-right', 'step-up'], twice: [1, 2] },
    };

    expect(routeFor(doubled)).toHaveLength(6);
    expect(routeFor(doubled).map((cell) => cell.col)).toEqual([0, 1, 2, 3, 4, 4]);
  });

  it('repeats the last step too, so the flag stands on the extra cell', () => {
    const last: Lesson = {
      ...lessonOne,
      game: { cards: ['step-right', 'step-up'], solution: ['step-right', 'step-up'], twice: [2] },
    };

    expect(routeFor(last)).toHaveLength(4);
    expect(routeFor(last)[3]).toEqual({ col: 1, row: -2 });
  });
});
