import sqlite3 from "sqlite3";

export type Db = sqlite3.Database;

export function createDb() {
    sqlite3.verbose();

    // Reutilizable: lo centralizamos aquí
    // User requested "disney.sql" specifically
    const filename = "data/disney.sqlite";
    return new sqlite3.Database(filename);
}