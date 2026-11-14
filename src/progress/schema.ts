/**
 * The progress shape stored on the device (plan D4).
 *
 * `completed` is the source of truth; a star is a completed lesson, so there is no separate
 * counter to drift. `current` is the lesson the child was last on.
 */
export const PROGRESS_KEY = 'code-block.progress.v1';
export const PROGRESS_VERSION = 1;

export type Progress = {
  readonly version: typeof PROGRESS_VERSION;
  readonly completed: readonly string[];
  readonly current: string;
};

/** What a brand-new child starts with. */
export function freshProgress(current: string): Progress {
  return { version: PROGRESS_VERSION, completed: [], current };
}

/**
 * Reads stored progress defensively. Absent, unparseable, wrongly shaped or future-versioned data
 * all return `null`, so the caller starts fresh instead of throwing (FR-9).
 */
export function parseProgress(raw: string | null): Progress | null {
  if (raw === null || raw.trim() === '') {
    return null;
  }

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.version !== PROGRESS_VERSION) {
    return null;
  }

  if (typeof candidate.current !== 'string' || candidate.current === '') {
    return null;
  }

  if (!Array.isArray(candidate.completed)) {
    return null;
  }

  const completed = candidate.completed.filter((id): id is string => typeof id === 'string');

  if (completed.length !== candidate.completed.length) {
    return null;
  }

  return { version: PROGRESS_VERSION, completed, current: candidate.current };
}
