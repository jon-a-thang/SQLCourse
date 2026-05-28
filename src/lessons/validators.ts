import { rowsKey } from '../db/initDb';

export function hasColumns(cols: string[], expected: string[]): boolean {
  const lower = cols.map((c) => c.toLowerCase());
  return expected.every((e) => lower.includes(e.toLowerCase()));
}

export function normalizeSql(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function sqlIncludes(sql: string, ...parts: string[]): boolean {
  const n = normalizeSql(sql);
  return parts.every((p) => n.includes(p.toLowerCase()));
}

export { rowsKey };

export function sortedNumbers(values: number[], ascending = true): boolean {
  const sorted = [...values].sort((a, b) => (ascending ? a - b : b - a));
  return values.every((v, i) => v === sorted[i]);
}
