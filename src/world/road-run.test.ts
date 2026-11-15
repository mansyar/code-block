import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tracePath } from './path';
import { runRoad } from './run';
import { STEP_MS } from './walk';

/**
 * The road-runner: what a game uses when a plan's arrows do not map one-to-one onto route cells,
 * because one of them is taken twice. It walks a road that has already been read, so the only rule
 * left here is the timing.
 *
 * Kept out of `run.test.ts` because structure rule 2 caps a file at 200 lines.
 */

/** Lesson 3's road: up, right, right, up — five cells, so index 4 is the flag. */
const ROUTE = tracePath(['step-up', 'step-right', 'step-right', 'step-up']);

function recorder(from = 0, to = 4) {
  const seen = { steps: [] as number[], halts: [] as number[], arrivals: 0 };

  return {
    seen,
    options: {
      route: ROUTE,
      from,
      to,
      onStep: (index: number) => seen.steps.push(index),
      onHalt: (index: number) => seen.halts.push(index),
      onArrive: () => {
        seen.arrivals += 1;
      },
    },
  };
}

function advance(ms: number) {
  vi.advanceTimersByTime(ms);
}

describe('a run along the road', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('walks one cell per beat and arrives once, on the last cell', () => {
    const { seen, options } = recorder();
    runRoad(options);

    advance(STEP_MS * 4);
    expect(seen.steps).toEqual([1, 2, 3, 4]);
    expect(seen.arrivals).toBe(1);

    advance(STEP_MS * 10);
    expect(seen.arrivals).toBe(1);
    expect(seen.halts).toEqual([]);
  });

  it('halts short of the flag, after the cells it could walk', () => {
    const { seen, options } = recorder(0, 2);
    runRoad(options);

    advance(STEP_MS * 2);
    expect(seen.steps).toEqual([1, 2]);
    expect(seen.halts).toEqual([]);

    advance(STEP_MS);
    expect(seen.halts).toEqual([2]);
    expect(seen.arrivals).toBe(0);
  });

  it('starts from wherever the walker already stands', () => {
    const { seen, options } = recorder(2, 4);
    runRoad(options);

    advance(STEP_MS * 2);

    expect(seen.steps).toEqual([3, 4]);
    expect(seen.arrivals).toBe(1);
  });

  it('cancels every timer when the lesson closes mid-walk', () => {
    const { seen, options } = recorder();
    const cancel = runRoad(options);

    advance(STEP_MS);
    cancel();
    advance(STEP_MS * 10);

    expect(seen.steps).toEqual([1]);
    expect(seen.arrivals).toBe(0);
    expect(seen.halts).toEqual([]);
  });
});
