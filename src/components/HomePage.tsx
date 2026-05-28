import { COURSE_MODULES, getContinueLesson, lessons, TOTAL_LESSONS } from '../lessons';
import type { ProgressState } from '../types';
import { AnnieGallery } from './AnnieGallery';

function getPrimaryButtonLabel(percent: number): string {
  if (percent >= 100) return 'Start over →';
  if (percent <= 0) return 'Begin lessons →';
  return 'Continue where you left off →';
}

interface HomePageProps {
  progress: ProgressState;
  loading: boolean;
  loadError: string | null;
  percent: number;
  minutesLeft: number;
  onPrimaryAction: () => void;
  onBrowseLessons: () => void;
  onAchievements: () => void;
}

export function HomePage({
  progress,
  loading,
  loadError,
  percent,
  minutesLeft,
  onPrimaryAction,
  onBrowseLessons,
  onAchievements,
}: HomePageProps) {
  const completed = progress.completedLessons.length;
  const allDone = percent >= 100;
  const notStarted = percent <= 0;
  const inProgress = !notStarted && !allDone;
  const continueLesson = getContinueLesson(progress.completedLessons);
  const continueMeta = lessons[continueLesson];
  const primaryLabel = getPrimaryButtonLabel(percent);

  return (
    <div className="home-screen">
      <div className="home-inner">
        <header className="home-header">
          <AnnieGallery variant="hero" photoIndex={0} />
          <p className="welcome-badge">Made with love, just for you</p>
          <h1>🐕 Annie&apos;s SQL Adventure</h1>
          <p className="welcome-lead">
            A full SQL course through <strong>Annie&apos;s dog park</strong> — {TOTAL_LESSONS}{' '}
            lessons, about <strong>4–5 hours</strong> at your own pace.
          </p>
          <ul className="welcome-features">
            <li>📖 6 parts — basics through joins &amp; more</li>
            <li>✍️ Type real queries, see instant results</li>
            <li>🏆 Achievements &amp; confetti when you level up</li>
            <li>✅ Progress saves automatically in your browser</li>
          </ul>
          <AnnieGallery />
        </header>

        <section className="home-progress-card">
          <div className="home-progress-top">
            <div>
              <p className="home-progress-label">Your progress</p>
              <p className="home-progress-stat">
                {completed} of {TOTAL_LESSONS} lessons
              </p>
            </div>
            <p className="home-progress-percent" aria-hidden>
              {percent}%
            </p>
          </div>
          <div className="course-progress-bar home-progress-bar">
            <div className="course-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          {!allDone && (
            <p className="home-progress-eta">About {minutesLeft} minutes left at your pace</p>
          )}
          {allDone && (
            <p className="home-progress-eta home-done-msg">
              You finished the whole course — Annie is so proud! 🎓
            </p>
          )}
        </section>
        <p className="home-tagline">
          {notStarted
            ? 'Ready to learn SQL with Annie?'
            : allDone
              ? 'You completed the whole course!'
              : 'Welcome back to the dog park!'}
        </p>

        <div className="home-actions">
          {loading ? (
            <p className="welcome-loading">Getting the dog park ready…</p>
          ) : loadError ? (
            <p className="welcome-error">{loadError}</p>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary btn-large home-btn-continue"
                onClick={onPrimaryAction}
              >
                {primaryLabel}
              </button>
              {notStarted && (
                <p className="home-continue-hint">
                  Starts with: {lessons.welcome.emoji} {lessons.welcome.title}
                </p>
              )}
              {inProgress && (
                <p className="home-continue-hint">
                  Up next: {continueMeta.emoji} {continueMeta.title}
                </p>
              )}
              {allDone && (
                <p className="home-continue-hint">
                  Start over resets your progress so you can run through again.
                </p>
              )}
              <button type="button" className="btn btn-secondary" onClick={onBrowseLessons}>
                Browse all lessons
              </button>
              <button type="button" className="btn btn-ghost home-achievements-btn" onClick={onAchievements}>
                🏆 View achievements ({progress.unlockedAchievements.length})
              </button>
            </>
          )}
        </div>

        <section className="home-modules">
          <h2>Course map</h2>
          <ul>
            {COURSE_MODULES.map((mod) => {
              const done = mod.lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
              const total = mod.lessonIds.length;
              const modPercent = Math.round((done / total) * 100);
              return (
                <li key={mod.id}>
                  <span className="home-mod-emoji" aria-hidden>
                    {mod.emoji}
                  </span>
                  <div className="home-mod-info">
                    <strong>{mod.title}</strong>
                    <span>
                      {done}/{total} lessons
                    </span>
                    <div className="home-mod-bar">
                      <div className="home-mod-fill" style={{ width: `${modPercent}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
