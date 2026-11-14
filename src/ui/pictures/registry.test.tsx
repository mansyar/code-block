import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PictureId } from '../../content/lesson';
import { pictureRegistry } from './registry';

const ids: readonly PictureId[] = ['bread', 'cheese', 'top'];

describe('pictureRegistry', () => {
  it.each(ids)('renders an svg for %s', (id) => {
    const Picture = pictureRegistry[id];
    const { container } = render(<Picture />);

    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 64 64');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });
});
