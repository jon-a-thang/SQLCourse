import type { Database } from 'sql.js/dist/sql-wasm-browser.js';
import { loadSql } from './sqlJs';

let dbPromise: Promise<Database> | null = null;

const SCHEMA = `
CREATE TABLE dogs (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  favorite_toy TEXT NOT NULL
);

CREATE TABLE treats (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  flavor TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE dog_treats (
  dog_id INTEGER NOT NULL,
  treat_id INTEGER NOT NULL,
  times_given INTEGER NOT NULL,
  FOREIGN KEY (dog_id) REFERENCES dogs(id),
  FOREIGN KEY (treat_id) REFERENCES treats(id)
);
`;

const SEED = `
INSERT INTO dogs (id, name, breed, age, favorite_toy) VALUES
  (1, 'Annie', 'mixed breed', 5, 'tennis ball'),
  (2, 'Buddy', 'labrador', 2, 'rope toy'),
  (3, 'Daisy', 'beagle', 3, 'squeaky duck'),
  (4, 'Rocky', 'bulldog', 1, 'chew bone'),
  (5, 'Cooper', 'golden retriever', 6, 'frisbee');

INSERT INTO treats (id, name, flavor, price) VALUES
  (1, 'Bacon Strips', 'meat', 4.99),
  (2, 'Peanut Butter Bites', 'peanut', 3.49),
  (3, 'Beef Jerky Chews', 'beef', 5.25),
  (4, 'Beef Minis', 'beef', 2.99);

INSERT INTO dog_treats (dog_id, treat_id, times_given) VALUES
  (1, 1, 12),
  (1, 4, 8),
  (2, 2, 20),
  (2, 3, 5),
  (3, 4, 15),
  (4, 1, 3),
  (4, 2, 10),
  (5, 3, 2);
`;

export async function getDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await loadSql();
      const db = new SQL.Database();
      db.run(SCHEMA);
      db.run(SEED);
      return db;
    })();
  }
  return dbPromise;
}

export function runQuery(
  db: Database,
  sql: string
): { columns: string[]; rows: string[][]; error?: string } {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { columns: [], rows: [], error: 'Type a query first — then hit Run!' };
  }

  try {
    const results = db.exec(trimmed);
    if (results.length === 0) {
      return {
        columns: [],
        rows: [],
        error: undefined,
      };
    }
    const { columns, values } = results[0];
    return {
      columns,
      rows: values.map((row) => row.map((cell) => (cell == null ? '' : String(cell)))),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Something went wrong with that query.';
    return { columns: [], rows: [], error: message };
  }
}

/** Normalize rows for comparison (order-independent when needed) */
export function rowsKey(columns: string[], rows: string[][]): string {
  const header = columns.join('|').toLowerCase();
  const body = [...rows]
    .map((r) => r.join('|'))
    .sort()
    .join('\n');
  return `${header}\n${body}`;
}
