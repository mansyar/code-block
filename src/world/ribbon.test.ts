import { describe, expect, it } from 'vitest';
import { type Cell, tracePath } from './path';
import { links } from './ribbon';

describe("the road's connections", () => {
  it('answers both sides of a cell the route passes through, in route order', () => {
    // Right, then up: the turn leaves the first side and arrives by the second.
    expect(links(tracePath(['step-right', 'step-up']), 1)).toEqual(['left', 'up']);
  });

  it('answers one side at each end of the route', () => {
    const route = tracePath(['step-right', 'step-up']);

    expect(links(route, 0)).toEqual(['right']);
    expect(links(route, 2)).toEqual(['down']);
  });

  it('answers nothing for a cell the route does not have', () => {
    expect(links(tracePath(['step-right']), 7)).toEqual([]);
  });

  it('answers one band where the road comes back along the side it left by', () => {
    const out = tracePath(['step-right', 'step-up']);
    // Up, then straight back down the way it came.
    const back: readonly Cell[] = [...out, { col: 1, row: 0 }];

    // Both neighbours of the turn sit below it: one side, one band, not two.
    expect(links(back, 2)).toEqual(['down']);
  });
});
