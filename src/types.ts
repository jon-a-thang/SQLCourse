export type ModuleId = 'basics' | 'filtering' | 'aggregates' | 'joins' | 'advanced' | 'capstone';

export type LessonId =
  | 'welcome'
  | 'select-all'
  | 'select-columns'
  | 'where'
  | 'order-by'
  | 'count'
  | 'and-or'
  | 'like'
  | 'in-not-in'
  | 'distinct'
  | 'sum-avg'
  | 'group-by'
  | 'having'
  | 'inner-join'
  | 'left-join'
  | 'join-three-tables'
  | 'aliases'
  | 'limit'
  | 'case-when'
  | 'subquery'
  | 'midterm-challenge'
  | 'final-challenge';

export type AchievementId =
  | 'first-steps'
  | 'query-writer'
  | 'filter-star'
  | 'join-master'
  | 'group-guru'
  | 'halfway-hero'
  | 'module-basics'
  | 'module-filtering'
  | 'module-aggregates'
  | 'module-joins'
  | 'module-advanced'
  | 'sql-graduate'
  | 'annie-champion';

export interface Lesson {
  id: LessonId;
  moduleId: ModuleId;
  emoji: string;
  title: string;
  subtitle: string;
  /** Rough minutes for pacing */
  minutes: number;
  story: string[];
  concepts: { term: string; plain: string }[];
  exampleQuery?: string;
  exampleCaption?: string;
  task: string;
  starterQuery?: string;
  hints: string[];
  solutionQuery?: string;
  validate: (rows: string[][], columns: string[]) => ValidationResult;
  exploreQueries?: string[];
}

export type ValidationResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export interface Achievement {
  id: AchievementId;
  emoji: string;
  title: string;
  description: string;
}

export interface ProgressState {
  completedLessons: LessonId[];
  unlockedAchievements: AchievementId[];
  currentLesson: LessonId;
}

export interface CelebrationPayload {
  lessonTitle: string;
  lessonEmoji: string;
  newAchievements: Achievement[];
}
