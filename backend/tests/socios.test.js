const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const Database = require('better-sqlite3');
const { closeDb, getDb } = require('../src/db');
const { createTestApp } = require('./helpers');

async function login(app, credentials) {
  const res = await request(app).post('/api/auth/login').send(credentials).expect(200);
  return res.body.data.token;
}

describe('CRUD de socios', () => {
  let ctx;
  let token;

  before(async () => {
    ctx = await createTestApp();
    token = await login(ctx.app, ctx.credentials);
  });

  after(async () => {
    await ctx.cleanup();
  });

  it('crea, consulta, edita y elimina un socio', async () => {
    const created = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Socio Prueba',
        correo: 'socio.prueba@example.com',
        telefono: '5551111',
      })
      .expect(201);

    assert.equal(created.body.data.nombre, 'Socio Prueba');
    assert.ok(created.body.data.fecha_alta);

    const listed = await request(ctx.app)
      .get('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.ok(listed.body.data.some((s) => s.id === created.body.data.id));

    const detail = await request(ctx.app)
      .get(`/api/socios/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    assert.equal(detail.body.data.correo, 'socio.prueba@example.com');

    const updated = await request(ctx.app)
      .patch(`/api/socios/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ telefono: '5552222' })
      .expect(200);
    assert.equal(updated.body.data.telefono, '5552222');

    await request(ctx.app)
      .delete(`/api/socios/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await request(ctx.app)
      .get(`/api/socios/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('rechaza correo duplicado con 409', async () => {
    await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Uno', correo: 'dup@example.com', telefono: '1' })
      .expect(201);

    const res = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Dos', correo: 'dup@example.com', telefono: '2' })
      .expect(409);

    assert.equal(res.body.error.code, 'CONFLICT');
  });

  it('rechaza datos inválidos con 400', async () => {
    const res = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'A', correo: 'no-email', telefono: 'x' })
      .expect(400);

    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    assert.ok(res.body.error.fields.nombre);
    assert.ok(res.body.error.fields.correo);
  });

  it('responde 404 para id inexistente', async () => {
    const res = await request(ctx.app)
      .get('/api/socios/99999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  });

  it('elimina dependencias y persiste datos al reabrir la base', async () => {
    const created = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Con Dependencias',
        correo: 'deps@example.com',
        telefono: '555',
      })
      .expect(201);

    const socioId = created.body.data.id;
    const planId = ctx.db
      .prepare(
        `INSERT INTO planes (nombre, precio_centavos, duracion_dias, activo)
         VALUES ('Mensual', 1000, 30, 1)`
      )
      .run().lastInsertRowid;

    ctx.db
      .prepare(
        `INSERT INTO membresias (
          socio_id, plan_id, plan_nombre, precio_centavos, duracion_dias,
          fecha_inicio, fecha_fin
        ) VALUES (?, ?, 'Mensual', 1000, 30, '2026-09-01', '2026-09-30')`
      )
      .run(socioId, planId);

    ctx.db
      .prepare(
        `INSERT INTO asistencias (socio_id, registrado_en, dia_local)
         VALUES (?, '2026-09-10T12:00:00.000Z', '2026-09-10')`
      )
      .run(socioId);

    await request(ctx.app)
      .delete(`/api/socios/${socioId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    assert.equal(
      ctx.db.prepare('SELECT COUNT(*) AS c FROM membresias WHERE socio_id = ?').get(socioId).c,
      0
    );
    assert.equal(
      ctx.db.prepare('SELECT COUNT(*) AS c FROM asistencias WHERE socio_id = ?').get(socioId).c,
      0
    );

    const persisted = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Persistente',
        correo: 'persistente@example.com',
        telefono: '1',
      })
      .expect(201);

    closeDb();
    const reopened = new Database(ctx.sqlitePath);
    const row = reopened
      .prepare('SELECT nombre FROM socios WHERE id = ?')
      .get(persisted.body.data.id);
    assert.equal(row.nombre, 'Persistente');
    reopened.close();
    ctx.db = getDb(ctx.sqlitePath);
  });

  it('permite búsqueda por nombre', async () => {
    await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Ana Buscable', correo: 'ana.b@example.com', telefono: '1' })
      .expect(201);

    const res = await request(ctx.app)
      .get('/api/socios')
      .query({ q: 'Buscable' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    assert.ok(res.body.data.some((s) => s.correo === 'ana.b@example.com'));
  });
});
