const { getDb } = require('../db');
const { config } = require('../config');
const { AppError } = require('../utils/AppError');
const { validateSocioPayload, parseId } = require('../utils/validate');
const { todayLocal } = require('../utils/dates');

function mapSocio(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
    telefono: row.telefono,
    fecha_alta: row.fecha_alta,
  };
}

function listSocios({ q } = {}) {
  const db = getDb();
  if (q && String(q).trim()) {
    const term = `%${String(q).trim()}%`;
    const rows = db
      .prepare(
        `SELECT id, nombre, correo, telefono, fecha_alta
         FROM socios
         WHERE nombre LIKE ? COLLATE NOCASE
            OR correo LIKE ? COLLATE NOCASE
            OR telefono LIKE ?
         ORDER BY nombre ASC`
      )
      .all(term, term, term);
    return rows.map(mapSocio);
  }

  const rows = db
    .prepare(
      `SELECT id, nombre, correo, telefono, fecha_alta
       FROM socios
       ORDER BY nombre ASC`
    )
    .all();
  return rows.map(mapSocio);
}

function getSocioById(idParam) {
  const id = parseId(idParam);
  const row = getDb()
    .prepare(
      `SELECT id, nombre, correo, telefono, fecha_alta
       FROM socios WHERE id = ?`
    )
    .get(id);

  if (!row) {
    throw new AppError(404, 'NOT_FOUND', 'Socio no encontrado');
  }
  return mapSocio(row);
}

function createSocio(body) {
  const data = validateSocioPayload(body, { partial: false });
  const fechaAlta = todayLocal(config.gymTimezone);
  const db = getDb();

  try {
    const result = db
      .prepare(
        `INSERT INTO socios (nombre, correo, telefono, fecha_alta)
         VALUES (?, ?, ?, ?)`
      )
      .run(data.nombre, data.correo, data.telefono, fechaAlta);

    return getSocioById(result.lastInsertRowid);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new AppError(409, 'CONFLICT', 'Ya existe un socio con ese correo', {
        correo: 'Correo duplicado',
      });
    }
    throw error;
  }
}

function updateSocio(idParam, body) {
  const id = parseId(idParam);
  getSocioById(id);
  const data = validateSocioPayload(body, { partial: true });

  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  fields.push(`actualizado_en = datetime('now')`);
  values.push(id);

  try {
    getDb()
      .prepare(`UPDATE socios SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values);
    return getSocioById(id);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new AppError(409, 'CONFLICT', 'Ya existe un socio con ese correo', {
        correo: 'Correo duplicado',
      });
    }
    throw error;
  }
}

function deleteSocio(idParam) {
  const id = parseId(idParam);
  getSocioById(id);

  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM asistencias WHERE socio_id = ?').run(id);
    db.prepare('DELETE FROM membresias WHERE socio_id = ?').run(id);
    db.prepare('DELETE FROM socios WHERE id = ?').run(id);
  });
  tx();
}

module.exports = {
  listSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
};
