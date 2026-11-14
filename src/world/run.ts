import { after, type Cell, type StepId } from './path';
import { STEP_MS } from './walk';

export type RunOptions = {
  /** The road, start first. The plan is checked against this and nothing else. */
  readonly route: readonly Cell[];
  /** The leg's plan, in the order the child chose it. */
  readonly plan: readonly StepId[];
  /** The route index the walker stands on now. */
  readonly from: number;
  /** The route index this leg ends at — the flag. */
  readonly to: number;
  /** One cell's worth of time. Injected so a test does not wait in real time. */
  readonly stepMs?: number;
  /** The walker reached this route index. */
  readonly onStep: (index: number) => void;
  /** The plan stopped short: the road does not continue that way. Never an ending. */
  readonly onHalt: (index: number) => void;
  /** The walker reached the leg's flag. Called at most once. */
  readonly onArrive: () => void;
};

/**
 * How many of the plan's steps the road actually continues.
 *
 * Each planned step is compared with the road's next cell, so a plan that turns the wrong way stops
 * exactly where the world stops — the walk stays literal, and the child never leaves the road.
 */
function stepsThatFit(
  route: readonly Cell[],
  plan: readonly StepId[],
  from: number,
  to: number,
): number {
  let taken = 0;

  while (taken < plan.length && from + taken < to) {
    const here = route[from + taken] as Cell;
    const wanted = route[from + taken + 1] as Cell;
    const landed = after(here, plan[taken] as StepId);

    if (landed.col !== wanted.col || landed.row !== wanted.row) {
      break;
    }

    taken += 1;
  }

  return taken;
}

/**
 * Walks a leg's plan: one cell per `STEP_MS`, stopping at the plan's end, at the flag, or where the
 * road does not continue.
 *
 * The timing lives here rather than in the game so both games that walk (repeat and plan) share one
 * idea of what "a run" is. A plan that does not fit still takes one beat before it reports being
 * stuck, so the child sees the press acknowledged instead of nothing happening.
 *
 * Returns the cancel function: every timer is cleared and no callback fires afterwards. Unmounting
 * mid-run therefore writes nothing.
 */
export function runPlan(options: RunOptions): () => void {
  const { route, plan, from, to, stepMs = STEP_MS, onStep, onHalt, onArrive } = options;
  const flagAt = Math.min(to, route.length - 1);
  const taken = stepsThatFit(route, plan, from, flagAt);
  const arrives = from + taken === flagAt;
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  for (let step = 1; step <= taken; step += 1) {
    timers.push(
      setTimeout(() => {
        if (!cancelled) {
          onStep(from + step);
        }
      }, stepMs * step),
    );
  }

  if (arrives) {
    timers.push(
      setTimeout(() => {
        if (!cancelled) {
          onArrive();
        }
      }, stepMs * taken),
    );
  } else {
    timers.push(
      setTimeout(
        () => {
          if (!cancelled) {
            onHalt(from + taken);
          }
        },
        stepMs * (taken + 1),
      ),
    );
  }

  return () => {
    cancelled = true;

    for (const timer of timers) {
      clearTimeout(timer);
    }
  };
}
