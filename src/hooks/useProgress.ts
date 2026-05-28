import { useCallback, useEffect, useState } from 'react';
import { checkNewAchievements, getAchievement, migrateProgress } from '../achievements';
import type { Achievement, AchievementId, LessonId, ProgressState } from '../types';
import { LESSON_ORDER } from '../lessons';

const STORAGE_KEY = 'annie-sql-progress-v2';

const defaultProgress: ProgressState = {
  completedLessons: [],
  unlockedAchievements: [],
  currentLesson: 'welcome',
};

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('annie-sql-progress-v1');
      if (legacy) {
        const migrated = migrateProgress(JSON.parse(legacy) as ProgressState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return defaultProgress;
    }
    const parsed = migrateProgress(JSON.parse(raw) as ProgressState);
    if (!LESSON_ORDER.includes(parsed.currentLesson)) return defaultProgress;
    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLesson = useCallback((id: LessonId): Achievement[] => {
    let newAchievements: Achievement[] = [];

    setProgress((prev) => {
      const completed = prev.completedLessons.includes(id)
        ? prev.completedLessons
        : [...prev.completedLessons, id];

      const newIds = checkNewAchievements(completed, prev.unlockedAchievements, id);
      newAchievements = newIds.map(getAchievement);

      const idx = LESSON_ORDER.indexOf(id);
      const next =
        idx >= 0 && idx < LESSON_ORDER.length - 1 ? LESSON_ORDER[idx + 1] : prev.currentLesson;

      return {
        completedLessons: completed,
        unlockedAchievements: [...prev.unlockedAchievements, ...newIds],
        currentLesson: next,
      };
    });

    return newAchievements;
  }, []);

  const goToLesson = useCallback((id: LessonId) => {
    setProgress((prev) => ({ ...prev, currentLesson: id }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('annie-sql-progress-v1');
  }, []);

  return { progress, completeLesson, goToLesson, resetProgress };
}

export type { AchievementId };
