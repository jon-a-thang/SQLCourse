interface TableViewProps {
  columns: string[];
  rows: string[][];
  emptyMessage?: string;
}

export function TableView({ columns, rows, emptyMessage }: TableViewProps) {
  if (columns.length === 0 && rows.length === 0) {
    return (
      <div className="table-empty">
        <span>📋</span>
        <p>{emptyMessage ?? 'Run a query to see results here.'}</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-meta">
        {rows.length} row{rows.length === 1 ? '' : 's'}
      </p>
    </div>
  );
}
