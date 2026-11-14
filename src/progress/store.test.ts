import { describe, expect, it } from 'vitest';
import type { LessonCard } from '../content/lesson';
import { curriculum, firstLesson } from '../content/lessons/index';
import { createMemoryStorage } from './local-storage';
import { freshProgress } from './schema';
import { isUnlocked } from './selectors';
import { createMemoryStore, createProgressStore } from './store';

function cardAt(index: number): LessonCard {
  const card = curriculum[index];

  if (card === undefined) {
    throw new Error(`the curriculum has no entry at ${index}`);
  }

  return card;
}

describe('createProgressStore', () => {
  it('opens on a fresh profile at the first lesson', () => {
    const store = createMemoryStore();

    expect(store.load()).toEqual(freshProgress(firstLesson.id));
    expect(store.starsFor()).toBe(0);
  });

  it('records one star however many times the lesson is finished', () => {
    const store = createMemoryStore();

    store.completeLesson(firstLesson.id);
    store.completeLesson(firstLesson.id);

    expect(store.load().completed).toEqual([firstLesson.id]);
    expect(store.starsFor()).toBe(1);
  });

  it('unlocks the next lesson and moves the current lesson on', () => {
    const store = createMemoryStore();

    const progress = store.completeLesson(firstLesson.id);

    expect(isUnlocked(cardAt(1), curriculum, progress)).toBe(true);
    expect(isUnlocked(cardAt(2), curriculum, progress)).toBe(false);
    expect(progress.current).toBe(cardAt(1).id);
  });

  it('keeps the current lesson when the curriculum runs out', () => {
    const last = cardAt(curriculum.length - 1);
    const store = createMemoryStore({ ...freshProgress(last.id), completed: [last.id] });

    expect(store.load().current).toBe(last.id);
  });

  it('reads back what it wrote through a new store on the same storage', () => {
    const storage = createMemoryStorage();
    createProgressStore(storage).completeLesson(firstLesson.id);

    const reread = createProgressStore(storage);

    expect(reread.load().completed).toEqual([firstLesson.id]);
    expect(reread.starsFor()).toBe(1);
    expect(isUnlocked(cardAt(1), curriculum, reread.load())).toBe(true);
  });
});
