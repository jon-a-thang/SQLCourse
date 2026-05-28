import { useEffect, useState } from 'react';
import type { Database } from 'sql.js/dist/sql-wasm-browser.js';
import type { Achievement } from './types';
import { getDatabase } from './db/initDb';
import {
  getContinueLesson,
  getCourseProgressPercent,
  getEstimatedMinutesRemaining,
  getLesson,
  getNextLesson,
  TOTAL_LESSONS,
} from './lessons';
import { useProgress } from './hooks/useProgress';
import { LessonSidebar } from './components/LessonSidebar';
import { LessonPanel } from './components/LessonPanel';
import { CelebrationModal } from './components/CelebrationModal';
import { AchievementsPanel } from './components/AchievementsPanel';
import { HomePage } from './components/HomePage';

type AppView = 'home' | 'course';

interface CelebrationState {
  lessonTitle: string;
  lessonEmoji: string;
  newAchievements: Achievement[];
}

export default function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('home');
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const { progress, completeLesson, goToLesson, resetProgress } = useProgress();

  const lesson = getLesson(progress.currentLesson);
  const nextId = getNextLesson(progress.currentLesson);
  const percent = getCourseProgressPercent(progress.completedLessons);
  const minutesLeft = getEstimatedMinutesRemaining(progress.completedLessons);
  const allDone = progress.completedLessons.length >= TOTAL_LESSONS;

  useEffect(() => {
    getDatabase()
      .then(setDb)
      .catch((err) => {
        console.error(err);
        setLoadError(
          'Could not load the practice database. Try refreshing the page — if it still fails, let me know!'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const openCourseAtContinue = () => {
    goToLesson(getContinueLesson(progress.completedLessons));
    setView('course');
  };

  const openCourseBrowse = () => {
    setView('course');
  };

  const handleHomePrimaryAction = () => {
    if (allDone) {
      if (
        confirm(
          'Start the course over? Your lesson progress and achievements will be reset.'
        )
      ) {
        resetProgress();
        goToLesson('welcome');
        setView('course');
      }
      return;
    }
    openCourseAtContinue();
  };

  const handleLessonSuccess = () => {
    const newAchievements = completeLesson(lesson.id);
    setCelebration({
      lessonTitle: lesson.title,
      lessonEmoji: lesson.emoji,
      newAchievements,
    });
  };

  if (view === 'home') {
    return (
      <>
        <HomePage
          progress={progress}
          loading={loading}
          loadError={loadError}
          percent={percent}
          minutesLeft={minutesLeft}
          onPrimaryAction={handleHomePrimaryAction}
          onBrowseLessons={openCourseBrowse}
          onAchievements={() => setShowAchievements(true)}
        />
        {showAchievements && (
          <AchievementsPanel
            unlocked={progress.unlockedAchievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="app">
      <header className="top-bar">
        <button type="button" className="brand brand-btn" onClick={() => setView('home')}>
          <span aria-hidden>🐕</span>
          <span>Annie&apos;s SQL</span>
        </button>
        <div className="course-progress" aria-label={`Course progress ${percent}%`}>
          <div className="course-progress-bar">
            <div className="course-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="course-progress-text">
            {progress.completedLessons.length}/{TOTAL_LESSONS} · ~{minutesLeft} min left
          </span>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowAchievements(true)}
          >
            🏆 Achievements ({progress.unlockedAchievements.length})
          </button>
          {allDone && <span className="graduate-badge">SQL Graduate 🎓</span>}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (confirm('Reset all lesson progress and achievements?')) {
                resetProgress();
                setView('home');
              }
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="layout">
        <LessonSidebar
          current={progress.currentLesson}
          completed={progress.completedLessons}
          onSelect={goToLesson}
        />

        <main className="main">
          {loading && <p className="loading-banner">Loading practice database…</p>}
          {loadError && <p className="error-banner">{loadError}</p>}
          <LessonPanel
            key={lesson.id}
            lesson={lesson}
            db={db}
            onSuccess={handleLessonSuccess}
          />
          {progress.completedLessons.includes(lesson.id) && nextId && !celebration && (
            <div className="next-lesson">
              <button type="button" className="btn btn-primary" onClick={() => goToLesson(nextId)}>
                Next lesson →
              </button>
            </div>
          )}
        </main>
      </div>

      {celebration && (
        <CelebrationModal
          lessonTitle={celebration.lessonTitle}
          lessonEmoji={celebration.lessonEmoji}
          newAchievements={celebration.newAchievements}
          onClose={() => setCelebration(null)}
        />
      )}

      {showAchievements && (
        <AchievementsPanel
          unlocked={progress.unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
}
