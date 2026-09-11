const { getDb } = require('../db');
const { config } = require('../config');
const { todayLocal } = require('../utils/dates');

/**
 * Definición de indicadores (día local = GYM_TIMEZONE):
 * - socios_activos: socios con al menos una membresía vigente hoy
 * - membresias_vencidas: filas de membresías con fecha_fin < hoy
 * - asistencias_hoy: asistencias con dia_local = hoy
 * - actividad_reciente: últimas 10 asistencias
 */
function getDashboard() {
  const db = getDb();
  const today = todayLocal(config.gymTimezone);

  const sociosActivos = db
    .prepare(
      `SELECT COUNT(DISTINCT socio_id) AS c
       FROM membresias
       WHERE fecha_inicio <= ? AND fecha_fin >= ?`
    )
    .get(today, today).c;

  const membresiasVencidas = db
    .prepare(
      `SELECT COUNT(*) AS c
       FROM membresias
       WHERE fecha_fin < ?`
    )
    .get(today).c;

  const asistenciasHoy = db
    .prepare(
      `SELECT COUNT(*) AS c
       FROM asistencias
       WHERE dia_local = ?`
    )
    .get(today).c;

  const actividad = db
    .prepare(
      `SELECT a.socio_id, s.nombre AS socio_nombre, a.registrado_en AS ocurrido_en
       FROM asistencias a
       INNER JOIN socios s ON s.id = a.socio_id
       ORDER BY a.registrado_en DESC, a.id DESC
       LIMIT 10`
    )
    .all()
    .map((row) => ({
      tipo: 'asistencia',
      socio_id: row.socio_id,
      socio_nombre: row.socio_nombre,
      ocurrido_en: row.ocurrido_en,
    }));

  return {
    socios_activos: sociosActivos,
    membresias_vencidas: membresiasVencidas,
    asistencias_hoy: asistenciasHoy,
    actividad_reciente: actividad,
  };
}

module.exports = { getDashboard };
