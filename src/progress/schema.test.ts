import { describe, expect, it } from 'vitest';
import { freshProgress, PROGRESS_VERSION, parseProgress } from './schema';

const invalidInputs: Array<[string, string | null]> = [
  ['absent data', null],
  ['an empty string', ''],
  ['truncated json', '{"'],
  ['a non-object', '"hello"'],
  ['a future version', '{"version":99,"completed":[],"current":"order"}'],
  ['a missing version', '{"completed":[],"current":"order"}'],
  ['a non-string current', '{"version":1,"completed":[],"current":7}'],
  ['a non-array completed', '{"version":1,"completed":"order","current":"order"}'],
  ['a non-string completed entry', '{"version":1,"completed":[1],"current":"order"}'],
];

describe('parseProgress', () => {
  it('starts a fresh profile with no stars at the first lesson', () => {
    expect(freshProgress('order')).toEqual({
      version: PROGRESS_VERSION,
      completed: [],
      current: 'order',
    });
  });

  it('round-trips a valid profile', () => {
    const progress = { version: PROGRESS_VERSION, completed: ['order'], current: 'repeat' };

    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
  });

  it.each(invalidInputs)('rejects %s', (_label, raw) => {
    expect(parseProgress(raw)).toBeNull();
  });
});
