import { COURSE_MODULES, lessons } from '../lessons';
import type { LessonId } from '../types';

interface LessonSidebarProps {
  current: LessonId;
  completed: LessonId[];
  onSelect: (id: LessonId) => void;
}

export function LessonSidebar({ current, completed, onSelect }: LessonSidebarProps) {
  let lessonIndex = 0;

  return (
    <nav className="sidebar" aria-label="Course lessons">
      {COURSE_MODULES.map((mod) => {
        const modDone = mod.lessonIds.filter((id) => completed.includes(id)).length;
        return (
          <section key={mod.id} className="sidebar-module">
            <div className="module-header">
              <span className="module-emoji" aria-hidden>
                {mod.emoji}
              </span>
              <div>
                <p className="module-title">{mod.title}</p>
                <p className="module-progress">
                  {modDone}/{mod.lessonIds.length}
                </p>
              </div>
            </div>
            <ul>
              {mod.lessonIds.map((id) => {
                lessonIndex += 1;
                const lesson = lessons[id];
                const done = completed.includes(id);
                const active = id === current;
                const num = lessonIndex;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`lesson-btn ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                      onClick={() => onSelect(id)}
                    >
                      <span className="lesson-num">{done ? '✓' : num}</span>
                      <span className="lesson-emoji">{lesson.emoji}</span>
                      <span className="lesson-label">{lesson.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
