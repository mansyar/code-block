import { curriculum, firstLesson } from '../content/lessons/index';
import type { ProgressStorage } from './local-storage';
import { createLocalStorage, createMemoryStorage } from './local-storage';
import { freshProgress, type Progress, parseProgress } from './schema';
import { nextLesson, starsFor } from './selectors';

export type ProgressStore = {
  readonly load: () => Progress;
  readonly completeLesson: (lessonId: string) => Progress;
  readonly starsFor: () => number;
};

/**
 * The progress store (plan D4). `completed` is the source of truth and a star is a completed
 * lesson, so completing the same lesson again is the same as completing it once. Every read goes
 * back through the storage, so what the caller gets is what a reload would see.
 */
export function createProgressStore(storage: ProgressStorage): ProgressStore {
  function load(): Progress {
    return parseProgress(storage.read()) ?? freshProgress(firstLesson.id);
  }

  return {
    load,
    completeLesson: (lessonId) => {
      const current = load();

      if (current.completed.includes(lessonId)) {
        return current;
      }

      const earned: Progress = { ...current, completed: [...current.completed, lessonId] };
      const next = nextLesson(curriculum, earned);
      const progress: Progress = { ...earned, current: next?.id ?? current.current };

      storage.write(JSON.stringify(progress));

      return progress;
    },
    starsFor: () => starsFor(load()),
  };
}

/** A store that forgets when the app closes. Used by tests, and when no browser storage exists. */
export function createMemoryStore(progress?: Progress): ProgressStore {
  const storage = createMemoryStorage();

  if (progress !== undefined) {
    storage.write(JSON.stringify(progress));
  }

  return createProgressStore(storage);
}

/** The app's store: the device's `localStorage` when it can be reached, memory when it cannot. */
export function createStore(): ProgressStore {
  try {
    if (typeof window !== 'undefined' && window.localStorage !== null) {
      return createProgressStore(createLocalStorage(window.localStorage));
    }
  } catch {
    // Reaching for window.localStorage itself can throw; fall through to memory.
  }

  return createMemoryStore();
}
