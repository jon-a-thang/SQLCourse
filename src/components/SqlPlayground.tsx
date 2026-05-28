import { useCallback, useEffect, useState } from 'react';
import type { Database } from 'sql.js/dist/sql-wasm-browser.js';
import { runQuery } from '../db/initDb';
import { TableView } from './TableView';

interface SqlPlaygroundProps {
  db: Database | null;
  starterQuery: string;
  onResult: (columns: string[], rows: string[][]) => void;
  readOnly?: boolean;
}

export function SqlPlayground({
  db,
  starterQuery,
  onResult,
  readOnly = false,
}: SqlPlaygroundProps) {
  const [sql, setSql] = useState(starterQuery);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setSql(starterQuery);
    setColumns([]);
    setRows([]);
    setError(undefined);
  }, [starterQuery]);

  const execute = useCallback(() => {
    if (!db) return;
    const result = runQuery(db, sql);
    setColumns(result.columns);
    setRows(result.rows);
    setError(result.error);
    if (!result.error) {
      onResult(result.columns, result.rows);
    }
  }, [db, sql, onResult]);

  return (
    <div className="playground">
      <label className="playground-label" htmlFor="sql-input">
        Your query
      </label>
      <div className="editor-row">
        <textarea
          id="sql-input"
          className="sql-input"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          rows={4}
          placeholder="SELECT * FROM dogs;"
        />
        <button type="button" className="btn btn-run" onClick={execute} disabled={!db}>
          ▶ Run
        </button>
      </div>
      {error && (
        <div className="feedback feedback-error" role="alert">
          <strong>Oops — </strong>
          {error}
        </div>
      )}
      <TableView
        columns={columns}
        rows={rows}
        emptyMessage={error ? undefined : 'Results will show up here after you run.'}
      />
    </div>
  );
}
