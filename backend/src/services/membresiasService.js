const { getDb } = require('../db');
const { config } = require('../config');
const { AppError } = require('../utils/AppError');
const { parseId } = require('../utils/validate');
const { todayLocal, addDaysInclusiveEnd, isValidDateOnly } = require('../utils/dates');
const { getSocioById } = require('./sociosService');
const { getPlanById } = require('./planesService');

function membershipStatus(fechaInicio, fechaFin, today) {
  if (today < fechaInicio) return 'futura';
  if (today > fechaFin) return 'vencida';
  return 'vigente';
}

function mapMembresia(row, today = todayLocal(config.gymTimezone)) {
  return {
    id: row.id,
    socio_id: row.socio_id,
    plan_id: row.plan_id,
    plan_nombre: row.plan_nombre,
    precio_centavos: row.precio_centavos,
    duracion_dias: row.duracion_dias,
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin,
    estado: membershipStatus(row.fecha_inicio, row.fecha_fin, today),
  };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

function listMembresiasBySocio(socioIdParam) {
  const socioId = parseId(socioIdParam, 'socio_id');
  getSocioById(socioId);

  const today = todayLocal(config.gymTimezone);
  const rows = getDb()
    .prepare(
      `SELECT id, socio_id, plan_id, plan_nombre, precio_centavos, duracion_dias,
              fecha_inicio, fecha_fin
       FROM membresias
       WHERE socio_id = ?
       ORDER BY fecha_inicio DESC, id DESC`
    )
    .all(socioId);

  return rows.map((row) => mapMembresia(row, today));
}

function assignMembresia(socioIdParam, body) {
  const socioId = parseId(socioIdParam, 'socio_id');
  getSocioById(socioId);

  const planId = parseId(body?.plan_id, 'plan_id');
  const plan = getPlanById(planId);

  if (!plan.activo) {
    throw new AppError(409, 'CONFLICT', 'No se puede asignar un plan inactivo', {
      plan_id: 'Plan inactivo',
    });
  }

  const fechaInicio = body?.fecha_inicio;
  if (!isValidDateOnly(fechaInicio)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', {
      fecha_inicio: 'Debe ser una fecha YYYY-MM-DD válida',
    });
  }

  const fechaFin = addDaysInclusiveEnd(fechaInicio, plan.duracion_dias);
  const existentes = getDb()
    .prepare(
      `SELECT fecha_inicio, fecha_fin FROM membresias WHERE socio_id = ?`
    )
    .all(socioId);

  for (const m of existentes) {
    if (rangesOverlap(fechaInicio, fechaFin, m.fecha_inicio, m.fecha_fin)) {
      throw new AppError(
        409,
        'CONFLICT',
        'La membresía se solapa con otra del mismo socio',
        { fecha_inicio: 'Periodo solapado' }
      );
    }
  }

  const result = getDb()
    .prepare(
      `INSERT INTO membresias (
        socio_id, plan_id, plan_nombre, precio_centavos, duracion_dias,
        fecha_inicio, fecha_fin
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      socioId,
      plan.id,
      plan.nombre,
      plan.precio_centavos,
      plan.duracion_dias,
      fechaInicio,
      fechaFin
    );

  const row = getDb()
    .prepare(
      `SELECT id, socio_id, plan_id, plan_nombre, precio_centavos, duracion_dias,
              fecha_inicio, fecha_fin
       FROM membresias WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return mapMembresia(row);
}

module.exports = {
  listMembresiasBySocio,
  assignMembresia,
  membershipStatus,
  mapMembresia,
};
