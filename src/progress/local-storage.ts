import { PROGRESS_KEY } from './schema';

/**
 * The string boundary progress is saved behind. Everything above it works with `Progress`; this is
 * the only place that knows about a key and a browser API (plan D4).
 */
export type ProgressStorage = {
  readonly read: () => string | null;
  readonly write: (value: string) => void;
};

/**
 * `localStorage`, defended.
 *
 * Locked-down Safari can throw on the property access as well as on a write, and a full quota
 * throws on write. Both degrade to "nothing saved yet" instead of breaking the app (FR-9).
 */
export function createLocalStorage(storage: Storage): ProgressStorage {
  return {
    read: () => {
      try {
        return storage.getItem(PROGRESS_KEY);
      } catch {
        return null;
      }
    },
    write: (value) => {
      try {
        storage.setItem(PROGRESS_KEY, value);
      } catch {
        // Private mode or a full quota: the session still works, it just will not survive a reload.
      }
    },
  };
}

/** Storage that lives as long as the object does — the default in tests and the fallback adapter. */
export function createMemoryStorage(): ProgressStorage {
  let value: string | null = null;

  return {
    read: () => value,
    write: (next) => {
      value = next;
    },
  };
}
