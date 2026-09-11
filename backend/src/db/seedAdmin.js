#!/usr/bin/env node
/**
 * Crea o actualiza el usuario administrador local.
 * Credenciales desde SEED_ADMIN_* en .env (nunca subir .env).
 */
const { migrate, getDb, closeDb } = require('./index');
const { hashPassword } = require('../services/authService');

async function seedAdmin() {
  const db = migrate(getDb());

  const nombre = process.env.SEED_ADMIN_NOMBRE || 'Administrador GymControl';
  const correo = process.env.SEED_ADMIN_CORREO || 'admin@gymcontrol.local';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password === 'cambia_esta_clave_local') {
    console.warn(
      'Aviso: usa una SEED_ADMIN_PASSWORD propia en .env antes de entornos compartidos.'
    );
  }

  if (!password) {
    throw new Error('SEED_ADMIN_PASSWORD es obligatoria para crear el usuario admin.');
  }

  const passwordHash = await hashPassword(password);
  const existing = db
    .prepare('SELECT id FROM usuarios WHERE correo = ? COLLATE NOCASE')
    .get(correo);

  if (existing) {
    db.prepare(
      `UPDATE usuarios
       SET nombre = ?, password_hash = ?
       WHERE id = ?`
    ).run(nombre, passwordHash, existing.id);
    console.log(`Usuario admin actualizado: ${correo}`);
  } else {
    db.prepare(
      `INSERT INTO usuarios (nombre, correo, password_hash)
       VALUES (?, ?, ?)`
    ).run(nombre, correo, passwordHash);
    console.log(`Usuario admin creado: ${correo}`);
  }
}

seedAdmin()
  .catch((error) => {
    console.error('Error al sembrar admin:', error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    closeDb();
  });
