import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { lessonOne } from '../content/lessons/0001-order';
import { routeFor, tracePath } from './path';
import { Track } from './Track';

/** Lesson 3's road — up, right, right, up — five cells, two legs, flags at cells 2 and 4 (D3). */
const TWO_LEG_ROUTE = tracePath(['step-up', 'step-right', 'step-right', 'step-up']);

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

  it('celebrates only when the arrival is being celebrated', () => {
    const placed = lessonOne.game.solution;
    const quiet = render(<Track route={routeFor(lessonOne)} position={3} placed={placed} />);

    expect(quiet.container.querySelector('[data-celebrate="true"]')).toBeNull();
    quiet.unmount();

    const loud = render(
      <Track route={routeFor(lessonOne)} position={3} placed={placed} celebrating />,
    );

    expect(loud.container.querySelector('[data-celebrate="true"]')).not.toBeNull();
    expect(loud.container.querySelectorAll('[data-sparks] span')).toHaveLength(6);
  });
});

describe('a road written in legs', () => {
  it('stands a flag at every leg boundary, so a two-leg walk shows two places to reach', () => {
    const { container } = render(
      <Track route={TWO_LEG_ROUTE} position={0} placed={[]} goals={[2, 4]} />,
    );

    const flags = Array.from(container.querySelectorAll('[data-goal="true"]'));

    expect(container.querySelectorAll('[data-cell]')).toHaveLength(5);
    expect(flags.map((flag) => flag.getAttribute('data-cell'))).toEqual(['2', '4']);
    // Still one start, still drawn differently from both flags.
    expect(container.querySelectorAll('[data-start="true"]')).toHaveLength(1);
  });

  it('gives the two flags their own cells on the grid, not one flag moved along', () => {
    const { container } = render(
      <Track route={TWO_LEG_ROUTE} position={0} placed={[]} goals={[2, 4]} />,
    );

    const flags = Array.from(container.querySelectorAll('[data-goal="true"]'));

    expect(
      flags.map((flag) => [flag.getAttribute('data-col'), flag.getAttribute('data-row')]),
    ).toEqual([
      ['1', '-1'],
      ['2', '-2'],
    ]);
  });

  it('celebrates at the last flag, never at the intermediate one', () => {
    const { container } = render(
      <Track route={TWO_LEG_ROUTE} position={4} placed={[]} goals={[2, 4]} celebrating />,
    );

    const sparks = container.querySelector('[data-sparks]');
    const style = sparks?.getAttribute('style') ?? '';

    // Cell 4 sits two columns in and on the lowest row, which is where the burst is anchored.
    expect(style).toContain('calc(2 * (var(--cell)');
    expect(style).toContain('calc(0 * (var(--cell)');
  });

  it('keeps a single flag at the end when a lesson declares no legs', () => {
    const { container } = render(
      <Track route={routeFor(lessonOne)} position={0} placed={[]} goals={undefined} />,
    );

    const goals = container.querySelectorAll('[data-goal="true"]');

    expect(goals).toHaveLength(1);
    expect(goals[0]).toHaveAttribute('data-cell', String(routeFor(lessonOne).length - 1));
  });
});
