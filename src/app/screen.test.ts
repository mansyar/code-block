import { describe, expect, it } from 'vitest';
import { initialScreen, screenReducer } from './screen';

describe('screenReducer', () => {
  it('starts on the map', () => {
    expect(initialScreen).toEqual({ kind: 'map' });
  });

  it('opens a lesson', () => {
    expect(screenReducer(initialScreen, { type: 'openLesson', lessonId: 'order' })).toEqual({
      kind: 'lesson',
      lessonId: 'order',
    });
  });

  it('returns to the map when the lesson closes', () => {
    const lesson = screenReducer(initialScreen, { type: 'openLesson', lessonId: 'order' });

    expect(screenReducer(lesson, { type: 'closeLesson' })).toEqual(initialScreen);
  });

  it('replaces one lesson with another', () => {
    const lesson = screenReducer(initialScreen, { type: 'openLesson', lessonId: 'order' });

    expect(screenReducer(lesson, { type: 'openLesson', lessonId: 'repeat' })).toEqual({
      kind: 'lesson',
      lessonId: 'repeat',
    });
  });
});
