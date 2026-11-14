import { describe, expect, it } from 'vitest';
import { curriculum } from '../content/lessons/index';
import { freshProgress, PROGRESS_VERSION, type Progress } from './schema';
import { isComplete, isUnlocked, nextLesson, starsFor } from './selectors';

const progressWith = (completed: readonly string[]): Progress => ({
  version: PROGRESS_VERSION,
  completed,
  current: completed.at(-1) ?? 'order',
});

const ids = curriculum.map((lesson) => lesson.id);

describe('isUnlocked', () => {
  it('opens only the first stop on a fresh profile', () => {
    const progress = freshProgress(ids[0] ?? 'order');

    expect(curriculum.map((lesson) => isUnlocked(lesson, curriculum, progress))).toEqual([
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('opens exactly one more stop per completed lesson', () => {
    const progress = progressWith(['order']);

    expect(curriculum.map((lesson) => isUnlocked(lesson, curriculum, progress))).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
  });

  it('keeps every earlier stop open after a later one is completed', () => {
    const progress = progressWith(ids.slice(0, 4));

    expect(curriculum.slice(0, 5).every((lesson) => isUnlocked(lesson, curriculum, progress))).toBe(
      true,
    );
    expect(isUnlocked(curriculum[5] as (typeof curriculum)[number], curriculum, progress)).toBe(
      false,
    );
  });

  it('opens every stop once the curriculum is complete', () => {
    const progress = progressWith(ids);

    expect(curriculum.every((lesson) => isUnlocked(lesson, curriculum, progress))).toBe(true);
    expect(nextLesson(curriculum, progress)).toBeUndefined();
  });

  it('refuses a lesson that is not in the curriculum', () => {
    const stray = { id: 'not-a-lesson', title: 'Stray', order: 9 };

    expect(isUnlocked(stray, curriculum, freshProgress('order'))).toBe(false);
  });
});

describe('starsFor and isComplete', () => {
  it('counts one star per completed lesson', () => {
    expect(starsFor(freshProgress('order'))).toBe(0);
    expect(starsFor(progressWith(['order', 'repeat']))).toBe(2);
  });

  it('knows which lessons are finished', () => {
    const progress = progressWith(['order']);

    expect(isComplete(curriculum[0] as (typeof curriculum)[number], progress)).toBe(true);
    expect(isComplete(curriculum[1] as (typeof curriculum)[number], progress)).toBe(false);
  });
});

describe('nextLesson', () => {
  it('points at the first lesson on a fresh profile', () => {
    expect(nextLesson(curriculum, freshProgress('order'))).toEqual(curriculum[0]);
  });

  it('moves on after a completion', () => {
    expect(nextLesson(curriculum, progressWith(['order']))).toEqual(curriculum[1]);
  });
});
