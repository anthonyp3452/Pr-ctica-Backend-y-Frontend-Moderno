const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { config } = require('../config');

let dbInstance = null;

function ensureDataDirectory(sqlitePath) {
  const dir = path.dirname(sqlitePath);
  fs.mkdirSync(dir, { recursive: true });
}

function getDb(sqlitePath = config.sqlitePath) {
  if (dbInstance && dbInstance.name === sqlitePath) {
    return dbInstance;
  }

  ensureDataDirectory(sqlitePath);
  const db = new Database(sqlitePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  dbInstance = db;
  return db;
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

function migrate(db = getDb()) {
  const migrationPath = path.join(__dirname, 'migrations', '001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  db.exec(sql);
  return db;
}

module.exports = { getDb, closeDb, migrate, ensureDataDirectory };
