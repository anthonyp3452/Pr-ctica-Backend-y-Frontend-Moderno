#!/usr/bin/env node
/**
 * Datos de ejemplo reproducibles para desarrollo local.
 * No incluye usuario de acceso: el seed de autenticación (C08) crea
 * el administrador a partir de SEED_ADMIN_* en el entorno local.
 * No subir .env ni bases con datos personales.
 */
const { migrate, getDb, closeDb } = require('./index');

function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function seed() {
  const db = migrate(getDb());

  const clear = db.transaction(() => {
    db.exec(`
      DELETE FROM asistencias;
      DELETE FROM membresias;
      DELETE FROM planes;
      DELETE FROM socios;
    `);

    const insertSocio = db.prepare(`
      INSERT INTO socios (nombre, correo, telefono, fecha_alta)
      VALUES (?, ?, ?, ?)
    `);
    const socios = [
      ['Ana López', 'ana.lopez@example.com', '55510001', '2026-01-10'],
      ['Bruno Pérez', 'bruno.perez@example.com', '55510002', '2026-02-05'],
      ['Carla Méndez', 'carla.mendez@example.com', '55510003', '2026-03-12'],
    ];
    const socioIds = socios.map((s) => insertSocio.run(...s).lastInsertRowid);

    const insertPlan = db.prepare(`
      INSERT INTO planes (nombre, precio_centavos, duracion_dias, activo)
      VALUES (?, ?, ?, ?)
    `);
    const planMensual = insertPlan.run('Mensual', 25000, 30, 1).lastInsertRowid;
    const planTrimestral = insertPlan.run('Trimestral', 65000, 90, 1).lastInsertRowid;
    insertPlan.run('Anual (archivado)', 200000, 365, 0);

    const insertMembresia = db.prepare(`
      INSERT INTO membresias (
        socio_id, plan_id, plan_nombre, precio_centavos, duracion_dias,
        fecha_inicio, fecha_fin
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const hoy = '2026-09-10';
    insertMembresia.run(
      socioIds[0],
      planMensual,
      'Mensual',
      25000,
      30,
      '2026-09-01',
      addDays('2026-09-01', 29)
    );
    insertMembresia.run(
      socioIds[1],
      planTrimestral,
      'Trimestral',
      65000,
      90,
      '2026-06-01',
      addDays('2026-06-01', 89)
    );

    const insertAsistencia = db.prepare(`
      INSERT INTO asistencias (socio_id, registrado_en, dia_local)
      VALUES (?, ?, ?)
    `);
    insertAsistencia.run(socioIds[0], `${hoy}T14:30:00.000Z`, hoy);
  });

  clear();
  console.log('Seed de datos de negocio aplicado (socios, planes, membresías, asistencias).');
}

try {
  seed();
} catch (error) {
  console.error('Error al sembrar datos:', error.message);
  process.exitCode = 1;
} finally {
  closeDb();
}
