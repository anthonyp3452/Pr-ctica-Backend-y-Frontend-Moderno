const { getDb } = require('../db');
const { config } = require('../config');
const { AppError } = require('../utils/AppError');
const { parseId } = require('../utils/validate');
const { todayLocal, isValidDateOnly } = require('../utils/dates');
const { getNow } = require('../utils/clock');
const { getSocioById } = require('./sociosService');

function mapAsistencia(row) {
  return {
    id: row.id,
    socio_id: row.socio_id,
    socio_nombre: row.socio_nombre,
    registrado_en: row.registrado_en,
    dia_local: row.dia_local,
  };
}

function hasVigenteMembership(socioId, day) {
  const row = getDb()
    .prepare(
      `SELECT id FROM membresias
       WHERE socio_id = ?
         AND fecha_inicio <= ?
         AND fecha_fin >= ?
       LIMIT 1`
    )
    .get(socioId, day, day);
  return Boolean(row);
}

function listAsistencias({ socio_id, desde, hasta } = {}) {
  const clauses = [];
  const params = [];

  if (socio_id !== undefined && socio_id !== null && socio_id !== '') {
    params.push(parseId(socio_id, 'socio_id'));
    clauses.push('a.socio_id = ?');
  }

  if (desde !== undefined && desde !== null && desde !== '') {
    if (!isValidDateOnly(desde)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', {
        desde: 'Debe ser YYYY-MM-DD',
      });
    }
    clauses.push('a.dia_local >= ?');
    params.push(desde);
  }

  if (hasta !== undefined && hasta !== null && hasta !== '') {
    if (!isValidDateOnly(hasta)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', {
        hasta: 'Debe ser YYYY-MM-DD',
      });
    }
    clauses.push('a.dia_local <= ?');
    params.push(hasta);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = getDb()
    .prepare(
      `SELECT a.id, a.socio_id, s.nombre AS socio_nombre, a.registrado_en, a.dia_local
       FROM asistencias a
       INNER JOIN socios s ON s.id = a.socio_id
       ${where}
       ORDER BY a.registrado_en DESC, a.id DESC`
    )
    .all(...params);

  return rows.map(mapAsistencia);
}

function registrarAsistencia(body) {
  const socioId = parseId(body?.socio_id, 'socio_id');
  getSocioById(socioId);

  const diaLocal = todayLocal(config.gymTimezone);
  if (!hasVigenteMembership(socioId, diaLocal)) {
    throw new AppError(
      409,
      'NO_ACTIVE_MEMBERSHIP',
      'El socio no tiene membresía vigente para registrar asistencia'
    );
  }

  const registradoEn = getNow().toISOString();

  try {
    const result = getDb()
      .prepare(
        `INSERT INTO asistencias (socio_id, registrado_en, dia_local)
         VALUES (?, ?, ?)`
      )
      .run(socioId, registradoEn, diaLocal);

    const row = getDb()
      .prepare(
        `SELECT a.id, a.socio_id, s.nombre AS socio_nombre, a.registrado_en, a.dia_local
         FROM asistencias a
         INNER JOIN socios s ON s.id = a.socio_id
         WHERE a.id = ?`
      )
      .get(result.lastInsertRowid);

    return mapAsistencia(row);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new AppError(
        409,
        'DUPLICATE_ATTENDANCE',
        'Ya existe una asistencia para este socio en el día local actual'
      );
    }
    throw error;
  }
}

module.exports = {
  listAsistencias,
  registrarAsistencia,
  hasVigenteMembership,
};
