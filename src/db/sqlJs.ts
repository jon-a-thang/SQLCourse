import type { SqlJsStatic } from 'sql.js/dist/sql-wasm-browser.js';

type InitSqlJs = (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;

let sqlPromise: Promise<SqlJsStatic> | null = null;

export function loadSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const mod = await import('sql.js/dist/sql-wasm-browser.js');
      const initSqlJs = ((mod as { default?: InitSqlJs }).default ?? mod) as InitSqlJs;
      return initSqlJs({
        locateFile: (file) => `${import.meta.env.BASE_URL}${file}`,
      });
    })();
  }
  return sqlPromise;
}
