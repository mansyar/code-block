import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tracePath } from './path';
import { Track } from './Track';

/**
 * The road is decoration, and decoration must never be a target.
 *
 * The band is a positioned element above the cell's static content, so it paints over a planned
 * step's button and would take the tap that belongs to it — a dead tap, which a four-year-old reads
 * as a broken app. Review R1-1 found exactly that, measured in the browser; these hold the fix.
 */

const ROUTE = tracePath(['step-up', 'step-right', 'step-right', 'step-up']);

describe('the road as a target', () => {
  it('declines every tap that lands on it', () => {
    const { container } = render(
      <Track route={ROUTE} position={0} placed={[]} goals={[2, 4]} onClear={() => undefined} />,
    );

    const bands = Array.from(container.querySelectorAll('[data-link]'));

    expect(bands.length).toBeGreaterThan(0);

    for (const band of bands) {
      expect(getComputedStyle(band).pointerEvents).toBe('none');
    }
  });

  it('leaves the planned step underneath it tappable', () => {
    const { container } = render(
      <Track
        route={ROUTE}
        position={0}
        placed={['step-up', 'step-right']}
        goals={[2, 4]}
        onClear={() => undefined}
      />,
    );

    // The step in the walker's cell is crossed by two bands and still has its own control.
    expect(container.querySelector('[data-cell="0"] [data-link]')).not.toBeNull();
    expect(container.querySelector('button[aria-label="step-up, planned"]')).not.toBeNull();
  });
});
