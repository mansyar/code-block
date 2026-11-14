import { beforeEach, describe, expect, it } from 'vitest';
import { firstLesson } from '../content/lessons/index';
import { createLocalStorage } from './local-storage';
import { freshProgress, PROGRESS_KEY } from './schema';
import { createProgressStore } from './store';

function localStore() {
  return createProgressStore(createLocalStorage(window.localStorage));
}

function hostileStorage(): Storage {
  return {
    length: 0,
    clear: () => {},
    getItem: () => {
      throw new Error('storage is denied');
    },
    key: () => null,
    removeItem: () => {},
    setItem: () => {
      throw new Error('storage is denied');
    },
  };
}

describe('createLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves under the namespaced key from D4', () => {
    expect(PROGRESS_KEY).toBe('code-block.progress.v1');

    localStore().completeLesson(firstLesson.id);

    expect(window.localStorage.getItem(PROGRESS_KEY)).toContain(`"${firstLesson.id}"`);
  });

  it('reads a star back through a second store, as a reload would', () => {
    localStore().completeLesson(firstLesson.id);

    expect(localStore().starsFor()).toBe(1);
  });

  it('starts fresh from an unparseable blob', () => {
    window.localStorage.setItem(PROGRESS_KEY, '"{"');

    expect(localStore().load()).toEqual(freshProgress(firstLesson.id));
  });

  it('starts fresh from a version it does not understand', () => {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ version: 99, completed: [firstLesson.id], current: 'repeat' }),
    );

    expect(localStore().load()).toEqual(freshProgress(firstLesson.id));
  });

  it('keeps working when the browser refuses to store anything', () => {
    const store = createProgressStore(createLocalStorage(hostileStorage()));

    expect(() => store.completeLesson(firstLesson.id)).not.toThrow();
    expect(store.load()).toEqual(freshProgress(firstLesson.id));
  });
});
