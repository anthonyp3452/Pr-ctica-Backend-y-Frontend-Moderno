const { getDb } = require('../db');
const { AppError } = require('../utils/AppError');
const { parseId, validatePlanPayload } = require('../utils/validate');

function mapPlan(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    precio_centavos: row.precio_centavos,
    duracion_dias: row.duracion_dias,
    activo: Boolean(row.activo),
  };
}

function listPlanes({ activo } = {}) {
  const db = getDb();
  if (activo === 'true' || activo === true) {
    return db
      .prepare(
        `SELECT id, nombre, precio_centavos, duracion_dias, activo
         FROM planes WHERE activo = 1 ORDER BY nombre ASC`
      )
      .all()
      .map(mapPlan);
  }
  if (activo === 'false' || activo === false) {
    return db
      .prepare(
        `SELECT id, nombre, precio_centavos, duracion_dias, activo
         FROM planes WHERE activo = 0 ORDER BY nombre ASC`
      )
      .all()
      .map(mapPlan);
  }

  return db
    .prepare(
      `SELECT id, nombre, precio_centavos, duracion_dias, activo
       FROM planes ORDER BY nombre ASC`
    )
    .all()
    .map(mapPlan);
}

function getPlanById(idParam) {
  const id = parseId(idParam);
  const row = getDb()
    .prepare(
      `SELECT id, nombre, precio_centavos, duracion_dias, activo
       FROM planes WHERE id = ?`
    )
    .get(id);

  if (!row) {
    throw new AppError(404, 'NOT_FOUND', 'Plan no encontrado');
  }
  return mapPlan(row);
}

function createPlan(body) {
  const data = validatePlanPayload(body, { partial: false });
  const result = getDb()
    .prepare(
      `INSERT INTO planes (nombre, precio_centavos, duracion_dias, activo)
       VALUES (?, ?, ?, 1)`
    )
    .run(data.nombre, data.precio_centavos, data.duracion_dias);

  return getPlanById(result.lastInsertRowid);
}

function updatePlan(idParam, body) {
  const id = parseId(idParam);
  getPlanById(id);
  const data = validatePlanPayload(body, { partial: true });

  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  fields.push(`actualizado_en = datetime('now')`);
  values.push(id);

  getDb()
    .prepare(`UPDATE planes SET ${fields.join(', ')} WHERE id = ?`)
    .run(...values);

  return getPlanById(id);
}

function deletePlan(idParam) {
  const id = parseId(idParam);
  getPlanById(id);

  const refs = getDb()
    .prepare('SELECT COUNT(*) AS c FROM membresias WHERE plan_id = ?')
    .get(id).c;

  if (refs > 0) {
    throw new AppError(
      409,
      'CONFLICT',
      'El plan tiene membresías asociadas; desactívalo en lugar de eliminarlo'
    );
  }

  getDb().prepare('DELETE FROM planes WHERE id = ?').run(id);
}

module.exports = {
  listPlanes,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  mapPlan,
};
