import type { Achievement, AchievementId, LessonId, ProgressState } from './types';
import { COURSE_MODULES, LESSON_ORDER } from './lessons/modules';

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  'first-steps': {
    id: 'first-steps',
    emoji: '🐾',
    title: 'First Steps',
    description: 'You ran your first query at the dog park!',
  },
  'query-writer': {
    id: 'query-writer',
    emoji: '✍️',
    title: 'Query Writer',
    description: 'You wrote SELECT queries on your own.',
  },
  'filter-star': {
    id: 'filter-star',
    emoji: '⭐',
    title: 'Filter Star',
    description: 'You mastered WHERE filters.',
  },
  'join-master': {
    id: 'join-master',
    emoji: '🔗',
    title: 'Join Master',
    description: 'You connected tables with INNER JOIN.',
  },
  'group-guru': {
    id: 'group-guru',
    emoji: '📊',
    title: 'Group Guru',
    description: 'You grouped data like a pro.',
  },
  'halfway-hero': {
    id: 'halfway-hero',
    emoji: '🌟',
    title: 'Halfway Hero',
    description: 'You completed half the course!',
  },
  'module-basics': {
    id: 'module-basics',
    emoji: '📖',
    title: 'Basics Badge',
    description: 'Part 1 complete — you can read data!',
  },
  'module-filtering': {
    id: 'module-filtering',
    emoji: '🔎',
    title: 'Filtering Badge',
    description: 'Part 2 complete — advanced filters unlocked.',
  },
  'module-aggregates': {
    id: 'module-aggregates',
    emoji: '🧮',
    title: 'Aggregates Badge',
    description: 'Part 3 complete — totals and groups!',
  },
  'module-joins': {
    id: 'module-joins',
    emoji: '🤝',
    title: 'Joins Badge',
    description: 'Part 4 complete — tables work together.',
  },
  'module-advanced': {
    id: 'module-advanced',
    emoji: '⚡',
    title: 'Power Tools Badge',
    description: 'Part 5 complete — advanced SQL tools!',
  },
  'sql-graduate': {
    id: 'sql-graduate',
    emoji: '🎓',
    title: 'SQL Graduate',
    description: 'You finished every lesson in the course!',
  },
  'annie-champion': {
    id: 'annie-champion',
    emoji: '🏆',
    title: "Annie's Champion",
    description: 'You crushed the final challenge!',
  },
};

const LESSON_ACHIEVEMENTS: Partial<Record<LessonId, AchievementId>> = {
  welcome: 'first-steps',
  'select-all': 'query-writer',
  where: 'filter-star',
  'inner-join': 'join-master',
  'group-by': 'group-guru',
  'final-challenge': 'annie-champion',
};

function moduleComplete(moduleLessonIds: LessonId[], completed: LessonId[]): boolean {
  return moduleLessonIds.every((id) => completed.includes(id));
}

export function checkNewAchievements(
  completedLessons: LessonId[],
  alreadyUnlocked: AchievementId[],
  justCompleted: LessonId
): AchievementId[] {
  const unlocked = new Set(alreadyUnlocked);
  const toAdd: AchievementId[] = [];

  const add = (id: AchievementId) => {
    if (!unlocked.has(id)) {
      unlocked.add(id);
      toAdd.push(id);
    }
  };

  const lessonAchievement = LESSON_ACHIEVEMENTS[justCompleted];
  if (lessonAchievement) add(lessonAchievement);

  if (completedLessons.length >= Math.ceil(LESSON_ORDER.length / 2)) {
    add('halfway-hero');
  }

  for (const mod of COURSE_MODULES) {
    if (moduleComplete(mod.lessonIds, completedLessons)) {
      const badge: AchievementId | undefined =
        mod.id === 'basics'
          ? 'module-basics'
          : mod.id === 'filtering'
            ? 'module-filtering'
            : mod.id === 'aggregates'
              ? 'module-aggregates'
              : mod.id === 'joins'
                ? 'module-joins'
                : mod.id === 'advanced'
                  ? 'module-advanced'
                  : undefined;
      if (badge) add(badge);
    }
  }

  if (completedLessons.length >= LESSON_ORDER.length) {
    add('sql-graduate');
  }

  return toAdd;
}

export function getAchievement(id: AchievementId): Achievement {
  return ACHIEVEMENTS[id];
}

export function migrateProgress(parsed: ProgressState): ProgressState {
  const mapLesson = (id: string): LessonId => {
    if (id === 'graduation') return 'midterm-challenge';
    return id as LessonId;
  };

  const completedLessons = [
    ...new Set(
      (parsed.completedLessons ?? []).map(mapLesson).filter((id) => LESSON_ORDER.includes(id))
    ),
  ];

  const currentLesson = LESSON_ORDER.includes(mapLesson(parsed.currentLesson))
    ? mapLesson(parsed.currentLesson)
    : 'welcome';

  const unlockedAchievements = (parsed.unlockedAchievements ?? []).filter(
    (id) => id in ACHIEVEMENTS
  );

  return { completedLessons, unlockedAchievements, currentLesson };
}
