import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { lessonOne } from '../content/lessons/0001-order';
import { routeFor, tracePath } from './path';
import { Track } from './Track';

describe('the road', () => {
  it('joins only consecutive cells with a ribbon, so no shortcut is drawn', () => {
    const { container } = render(<Track route={routeFor(lessonOne)} position={0} placed={[]} />);

    const roads = Array.from(container.querySelectorAll('[data-road]'));
    const cells = container.querySelectorAll('[data-cell]');

    expect(roads).toHaveLength(cells.length - 1);
    expect(roads.map((road) => road.getAttribute('data-road'))).toEqual([
      'vertical',
      'horizontal',
      'vertical',
    ]);
  });

  it('draws the start and the goal as different pads', () => {
    const { container } = render(<Track route={routeFor(lessonOne)} position={0} placed={[]} />);

    const starts = container.querySelectorAll('[data-start="true"]');
    const goals = container.querySelectorAll('[data-goal="true"]');

    expect(starts).toHaveLength(1);
    expect(goals).toHaveLength(1);
    expect(starts[0]).toHaveAttribute('data-cell', '0');
    expect(goals[0]).toHaveAttribute('data-cell', String(routeFor(lessonOne).length - 1));
    // They are also the two ends of the road: nothing between them is start or goal.
    expect(starts[0]).not.toBe(goals[0]);
  });

  it('runs a straight road with only horizontal ribbons', () => {
    const route = tracePath(['step-right', 'step-right']);
    const { container } = render(<Track route={route} position={0} placed={[]} />);

    expect(
      Array.from(container.querySelectorAll('[data-road]')).map((road) =>
        road.getAttribute('data-road'),
      ),
    ).toEqual(['horizontal', 'horizontal']);
    expect(container.querySelector('[data-rows]')).toHaveAttribute('data-rows', '1');
  });

  it('keeps the walker on the cell his index names', () => {
    const route = routeFor(lessonOne);
    const placed = lessonOne.game.solution.slice(0, 2);
    const { container } = render(<Track route={route} position={2} placed={placed} />);

    const walker = container.querySelector('[data-walker="true"]');

    expect(walker).toHaveAttribute('data-cell', '2');
    expect(walker).toHaveAttribute('data-col', '1');
    expect(walker).toHaveAttribute('data-row', '-1');
  });
});
