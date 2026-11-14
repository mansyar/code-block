import type { LessonCard } from '../content/lesson';
import type { Progress } from './schema';

/** One star per completed lesson (plan D4). */
export function starsFor(progress: Progress): number {
  return progress.completed.length;
}

export function isComplete(lesson: LessonCard, progress: Progress): boolean {
  return progress.completed.includes(lesson.id);
}

/**
 * Index of the furthest completed lesson, or -1 for a fresh profile.
 */
export function highestCompletedIndex(
  curriculum: readonly LessonCard[],
  progress: Progress,
): number {
  return curriculum.reduce(
    (highest, lesson, index) => (isComplete(lesson, progress) ? Math.max(highest, index) : highest),
    -1,
  );
}

/**
 * A lesson is open when it sits at or before the stop just after the furthest completed one — so a
 * fresh profile has only the first node open, and finishing a lesson opens exactly one more
 * (plan D4).
 */
export function isUnlocked(
  lesson: LessonCard,
  curriculum: readonly LessonCard[],
  progress: Progress,
): boolean {
  const index = curriculum.findIndex((entry) => entry.id === lesson.id);

  if (index === -1) {
    return false;
  }

  return index <= highestCompletedIndex(curriculum, progress) + 1;
}

/** The lesson the child should play next, if any is left. */
export function nextLesson(
  curriculum: readonly LessonCard[],
  progress: Progress,
): LessonCard | undefined {
  return curriculum[highestCompletedIndex(curriculum, progress) + 1];
}
