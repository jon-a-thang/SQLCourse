import type { LessonId, ModuleId } from '../types';

export interface CourseModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  emoji: string;
  lessonIds: LessonId[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'basics',
    title: 'Part 1: The Basics',
    subtitle: 'Reading data',
    emoji: '📖',
    lessonIds: ['welcome', 'select-all', 'select-columns', 'where', 'order-by', 'count'],
  },
  {
    id: 'filtering',
    title: 'Part 2: Smarter Filters',
    subtitle: 'AND, OR, patterns',
    emoji: '🔎',
    lessonIds: ['and-or', 'like', 'in-not-in', 'distinct'],
  },
  {
    id: 'aggregates',
    title: 'Part 3: Totals & Groups',
    subtitle: 'GROUP BY & friends',
    emoji: '📊',
    lessonIds: ['sum-avg', 'group-by', 'having'],
  },
  {
    id: 'joins',
    title: 'Part 4: Connecting Tables',
    subtitle: 'JOINs',
    emoji: '🔗',
    lessonIds: ['inner-join', 'left-join', 'join-three-tables'],
  },
  {
    id: 'advanced',
    title: 'Part 5: Power Tools',
    subtitle: 'Aliases, LIMIT, more',
    emoji: '⚡',
    lessonIds: ['aliases', 'limit', 'case-when', 'subquery'],
  },
  {
    id: 'capstone',
    title: 'Part 6: Challenges',
    subtitle: 'Put it all together',
    emoji: '🏆',
    lessonIds: ['midterm-challenge', 'final-challenge'],
  },
];

export const LESSON_ORDER: LessonId[] = COURSE_MODULES.flatMap((m) => m.lessonIds);

export function getModuleForLesson(lessonId: LessonId): CourseModule | undefined {
  return COURSE_MODULES.find((m) => m.lessonIds.includes(lessonId));
}

export const TOTAL_LESSONS = LESSON_ORDER.length;
