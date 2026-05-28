import { useEffect } from 'react';
import type { Achievement } from '../types';
import { fireAchievementConfetti, fireLessonConfetti } from '../utils/celebrate';

interface CelebrationModalProps {
  lessonTitle: string;
  lessonEmoji: string;
  newAchievements: Achievement[];
  onClose: () => void;
}

export function CelebrationModal({
  lessonTitle,
  lessonEmoji,
  newAchievements,
  onClose,
}: CelebrationModalProps) {
  useEffect(() => {
    if (newAchievements.length > 0) {
      fireAchievementConfetti();
    } else {
      fireLessonConfetti();
    }
  }, [newAchievements.length]);

  return (
    <div className="celebration-backdrop" role="dialog" aria-modal="true" aria-labelledby="celebration-title">
      <div className="celebration-card">
        <p className="celebration-emoji" aria-hidden>
          {lessonEmoji}
        </p>
        <h2 id="celebration-title">Lesson complete!</h2>
        <p className="celebration-lesson">{lessonTitle}</p>

        {newAchievements.length > 0 && (
          <div className="celebration-achievements">
            <p className="celebration-achievements-heading">
              {newAchievements.length === 1 ? 'New achievement!' : 'New achievements!'}
            </p>
            <ul>
              {newAchievements.map((a) => (
                <li key={a.id}>
                  <span className="achievement-badge">{a.emoji}</span>
                  <div>
                    <strong>{a.title}</strong>
                    <span>{a.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" className="btn btn-primary btn-large" onClick={onClose}>
          Keep going →
        </button>
      </div>
    </div>
  );
}
