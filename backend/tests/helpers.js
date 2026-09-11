const fs = require('fs');
const os = require('os');
const path = require('path');
const { closeDb, getDb, migrate } = require('../src/db');
const { createApp } = require('../src/app');
const { hashPassword } = require('../src/services/authService');

async function createTestApp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gymcontrol-'));
  const sqlitePath = path.join(dir, 'test.sqlite');

  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_do_not_use_in_prod';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
  process.env.GYM_TIMEZONE = 'America/Guatemala';
  process.env.SQLITE_PATH = sqlitePath;

  // Recargar config vía getDb con ruta explícita
  closeDb();
  const db = migrate(getDb(sqlitePath));

  const passwordHash = await hashPassword('admin123');
  db.prepare(
    `INSERT INTO usuarios (nombre, correo, password_hash)
     VALUES (?, ?, ?)`
  ).run('Admin Test', 'admin@test.local', passwordHash);

  const app = createApp({ migrateOnStart: false });

  return {
    app,
    db,
    sqlitePath,
    dir,
    credentials: { correo: 'admin@test.local', password: 'admin123' },
    async cleanup() {
      closeDb();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

module.exports = { createTestApp };
