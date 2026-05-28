import type { Lesson, LessonId } from '../types';
import { LESSON_ORDER } from './modules';
import { basicsLessons } from './part1-basics';
import { filteringLessons } from './part2-filtering';
import { aggregatesLessons } from './part3-aggregates';
import { joinsLessons } from './part4-joins';
import { advancedLessons } from './part5-advanced';
import { capstoneLessons } from './part6-capstone';

export { LESSON_ORDER, COURSE_MODULES, TOTAL_LESSONS, getModuleForLesson } from './modules';

export const lessons: Record<LessonId, Lesson> = {
  ...basicsLessons,
  ...filteringLessons,
  ...aggregatesLessons,
  ...joinsLessons,
  ...advancedLessons,
  ...capstoneLessons,
} as Record<LessonId, Lesson>;

export function getLesson(id: LessonId): Lesson {
  return lessons[id];
}

export function getNextLesson(id: LessonId): LessonId | null {
  const i = LESSON_ORDER.indexOf(id);
  if (i < 0 || i >= LESSON_ORDER.length - 1) return null;
  return LESSON_ORDER[i + 1];
}

export function getCourseProgressPercent(completed: LessonId[]): number {
  if (LESSON_ORDER.length === 0) return 0;
  return Math.round((completed.length / LESSON_ORDER.length) * 100);
}

export function getEstimatedMinutesRemaining(completed: LessonId[]): number {
  return LESSON_ORDER.filter((id) => !completed.includes(id)).reduce(
    (sum, id) => sum + lessons[id].minutes,
    0
  );
}

/** First incomplete lesson, or last lesson if everything is done */
export function getContinueLesson(completed: LessonId[]): LessonId {
  const next = LESSON_ORDER.find((id) => !completed.includes(id));
  return next ?? LESSON_ORDER[LESSON_ORDER.length - 1];
}
