
import sqlite3 from 'sqlite3';
import { createDb } from './db.js';

const db = createDb();

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Tables:", tables);

        tables.forEach((table: any) => {
            db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Schema for ${table.name}:`, columns);
            });

            // let's also peek at some data
            db.all(`SELECT * FROM ${table.name} LIMIT 3`, [], (err, rows) => {
                console.log(`Data preview for ${table.name}:`, rows);
            });
        });
    });
});
