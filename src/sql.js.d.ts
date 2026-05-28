declare module 'sql.js/dist/sql-wasm-browser.js' {
  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  export interface QueryExecResult {
    columns: string[];
    values: SqlValue[][];
  }

  export type SqlValue = string | number | Uint8Array | null;

  export interface Database {
    run(sql: string, params?: unknown[]): Database;
    exec(sql: string): QueryExecResult[];
  }

  export interface InitSqlJsConfig {
    locateFile?: (file: string) => string;
  }

  function initSqlJs(config?: InitSqlJsConfig): Promise<SqlJsStatic>;
  export default initSqlJs;
}
