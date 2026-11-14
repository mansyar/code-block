import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type StepId, tracePath } from './path';
import { runPlan } from './run';
import { STEP_MS } from './walk';

/** Lesson 3's road: up, right, right, up — two legs, the first ending at cell 2. */
const ROUTE = tracePath(['step-up', 'step-right', 'step-right', 'step-up']);

type Recorder = {
  readonly steps: number[];
  readonly halts: number[];
  readonly arrivals: number[];
};

function record() {
  const seen: Recorder = { steps: [], halts: [], arrivals: [] };

  return {
    seen,
    options: (plan: readonly StepId[], from = 0, to = 2) => ({
      route: ROUTE,
      plan,
      from,
      to,
      onStep: (index: number) => seen.steps.push(index),
      onHalt: (index: number) => seen.halts.push(index),
      onArrive: () => seen.arrivals.push(from),
    }),
  };
}

function advance(ms: number) {
  vi.advanceTimersByTime(ms);
}

describe('a run', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('walks the plan one cell per step and arrives once, at the flag', () => {
    const { seen, options } = record();
    runPlan(options(['step-up', 'step-right']));

    advance(STEP_MS);
    expect(seen.steps).toEqual([1]);

    advance(STEP_MS);
    expect(seen.steps).toEqual([1, 2]);
    expect(seen.arrivals).toHaveLength(1);
    expect(seen.halts).toEqual([]);

    advance(STEP_MS * 10);
    // Never twice, however long the clock runs.
    expect(seen.arrivals).toHaveLength(1);
  });

  it('halts where the road stops instead of walking off it', () => {
    const { seen, options } = record();
    // Up is the road; right would leave it, because the second cell turns up.
    runPlan(options(['step-up', 'step-up']));

    advance(STEP_MS);
    expect(seen.steps).toEqual([1]);

    advance(STEP_MS);
    expect(seen.halts).toEqual([1]);
    expect(seen.arrivals).toEqual([]);
    expect(seen.steps).toEqual([1]);
  });

  it('halts on the first step when the plan starts the wrong way, after one beat', () => {
    const { seen, options } = record();
    runPlan(options(['step-right']));

    advance(STEP_MS - 1);
    expect(seen.halts).toEqual([]);

    advance(1);
    expect(seen.halts).toEqual([0]);
    expect(seen.steps).toEqual([]);
  });

  it('stops at the leg flag even when the plan is longer than the leg', () => {
    const { seen, options } = record();
    runPlan(options(['step-up', 'step-right', 'step-right', 'step-up']));

    advance(STEP_MS * 2);

    expect(seen.steps).toEqual([1, 2]);
    expect(seen.arrivals).toHaveLength(1);
    // The last two steps belong to no leg of this run and were never taken.
    expect(seen.halts).toEqual([]);
  });

  it('halts short when the plan is shorter than the leg', () => {
    const { seen, options } = record();
    runPlan(options(['step-up']));

    advance(STEP_MS);
    expect(seen.steps).toEqual([1]);

    advance(STEP_MS);
    expect(seen.halts).toEqual([1]);
    expect(seen.arrivals).toEqual([]);
  });

  it('walks a second leg from where the first one stopped', () => {
    const { seen, options } = record();
    runPlan(options(['step-right', 'step-up'], 2, 4));

    advance(STEP_MS * 2);

    expect(seen.steps).toEqual([3, 4]);
    expect(seen.arrivals).toEqual([2]);
  });

  it('cancels everything when the lesson closes mid-run', () => {
    const { seen, options } = record();
    const cancel = runPlan(options(['step-up', 'step-right']));

    advance(STEP_MS);
    cancel();
    advance(STEP_MS * 10);

    expect(seen.steps).toEqual([1]);
    expect(seen.arrivals).toEqual([]);
    expect(seen.halts).toEqual([]);
  });
});
