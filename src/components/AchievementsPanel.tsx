import { ACHIEVEMENTS } from '../achievements';
import type { AchievementId } from '../types';

interface AchievementsPanelProps {
  unlocked: AchievementId[];
  onClose: () => void;
}

export function AchievementsPanel({ unlocked, onClose }: AchievementsPanelProps) {
  const all = Object.values(ACHIEVEMENTS);
  const set = new Set(unlocked);

  return (
    <div className="achievements-backdrop" onClick={onClose} role="presentation">
      <div
        className="achievements-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="achievements-title"
      >
        <header className="achievements-header">
          <h2 id="achievements-title">Achievements</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <p className="achievements-progress">
          {unlocked.length} of {all.length} unlocked
        </p>
        <ul className="achievements-list">
          {all.map((a) => {
            const got = set.has(a.id);
            return (
              <li key={a.id} className={got ? 'unlocked' : 'locked'}>
                <span className="achievement-badge" aria-hidden>
                  {got ? a.emoji : '🔒'}
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <span>{a.description}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
