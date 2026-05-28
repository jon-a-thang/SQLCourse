import { useCallback, useState } from 'react';
import type { Lesson } from '../types';
import type { Database } from 'sql.js/dist/sql-wasm-browser.js';
import { SqlPlayground } from './SqlPlayground';
import { AnnieGallery } from './AnnieGallery';

interface LessonPanelProps {
  lesson: Lesson;
  db: Database | null;
  onSuccess: () => void;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export function LessonPanel({ lesson, db, onSuccess }: LessonPanelProps) {
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [passed, setPassed] = useState(false);

  const handleResult = useCallback(
    (columns: string[], rows: string[][]) => {
      const result = lesson.validate(rows, columns);
      setFeedback({ ok: result.ok, message: result.message });
      if (result.ok && !passed) {
        setPassed(true);
        onSuccess();
      }
    },
    [lesson, onSuccess, passed]
  );

  const showHint = () => {
    setHintIndex((i) => Math.min(i + 1, lesson.hints.length));
  };

  const starter = lesson.starterQuery ?? 'SELECT * FROM dogs;';

  return (
    <article className="lesson-panel">
      <header className="lesson-header">
        <span className="lesson-big-emoji" aria-hidden>
          {lesson.emoji}
        </span>
        <div>
          <h1>{lesson.title}</h1>
          <p className="lesson-subtitle">
            {lesson.subtitle} · ~{lesson.minutes} min
          </p>
        </div>
      </header>

      {lesson.id === 'welcome' && <AnnieGallery variant="hero" photoIndex={0} />}
      {lesson.id === 'final-challenge' && <AnnieGallery variant="hero" photoIndex={4} />}

      <section className="story">
        {lesson.story.map((para, i) => (
          <p key={i}>{renderInlineMarkdown(para)}</p>
        ))}
      </section>

      {lesson.concepts.length > 0 && (
        <section className="concepts">
          <h2>Good to know</h2>
          <dl>
            {lesson.concepts.map((c) => (
              <div key={c.term} className="concept-row">
                <dt>{c.term}</dt>
                <dd>{c.plain}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {lesson.exampleQuery && (
        <section className="example">
          <h2>Example</h2>
          <pre className="code-block">{lesson.exampleQuery}</pre>
          {lesson.exampleCaption && <p className="example-caption">{lesson.exampleCaption}</p>}
        </section>
      )}

      <section className="task-box">
        <h2>Your turn</h2>
        <p>{lesson.task}</p>
      </section>

      <SqlPlayground db={db} starterQuery={starter} onResult={handleResult} />

      <div className="lesson-actions">
        <button type="button" className="btn btn-hint" onClick={showHint}>
          💡 Hint {hintIndex > 0 ? `(${hintIndex}/${lesson.hints.length})` : ''}
        </button>
        {lesson.solutionQuery && passed && (
          <p className="solution-reveal">
            One way to solve it: <code>{lesson.solutionQuery}</code>
          </p>
        )}
      </div>

      {hintIndex > 0 && (
        <ul className="hints-list">
          {lesson.hints.slice(0, hintIndex).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {feedback && (
        <div
          className={`feedback ${feedback.ok ? 'feedback-success' : 'feedback-warn'}`}
          role="status"
        >
          {feedback.ok ? '🎉 ' : '💪 '}
          {feedback.message}
        </div>
      )}

      {lesson.exploreQueries && lesson.exploreQueries.length > 1 && (
        <section className="explore">
          <h2>Explore more tables</h2>
          <p className="explore-note">Try these in the box above when you are curious:</p>
          <ul>
            {lesson.exploreQueries.map((q) => (
              <li key={q}>
                <code>{q}</code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
