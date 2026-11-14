import type { Lesson, LessonCard } from '../lesson';
import { lessonOne } from './0001-order';
import { lessonTwo } from './0002-repeat';
import { lessonThree } from './0003-cause';

/**
 * The curriculum: every stop on the journey map, in order. Lessons 4–6 are planned and appear as
 * locked stops; lessons 1, 2 and 3 have content.
 */
export const curriculum: readonly LessonCard[] = [
  { id: 'order', title: 'Walk the path', order: 1 },
  { id: 'repeat', title: 'Do it again', order: 2 },
  { id: 'cause', title: 'Make it move', order: 3 },
  { id: 'condition', title: 'If it is red', order: 4 },
  { id: 'debug', title: 'Find the wrong step', order: 5 },
  { id: 'remember', title: 'The box that remembers', order: 6 },
];

/** Lessons that actually have content. Grows one entry per lesson track. */
export const lessons: readonly Lesson[] = [lessonOne, lessonTwo, lessonThree];

const first = curriculum[0];

if (first === undefined) {
  throw new Error('the curriculum is empty');
}

/** The lesson a fresh profile starts at. */
export const firstLesson: LessonCard = first;

export function findLesson(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
