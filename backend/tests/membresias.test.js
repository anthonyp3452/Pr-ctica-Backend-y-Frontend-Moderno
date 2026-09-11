const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createTestApp } = require('./helpers');
const { addDaysInclusiveEnd } = require('../src/utils/dates');

async function login(app, credentials) {
  const res = await request(app).post('/api/auth/login').send(credentials).expect(200);
  return res.body.data.token;
}

describe('Planes y membresías', () => {
  let ctx;
  let token;
  let socioId;

  before(async () => {
    ctx = await createTestApp();
    token = await login(ctx.app, ctx.credentials);

    const socio = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Socio Membresia',
        correo: 'membresia@example.com',
        telefono: '555',
      })
      .expect(201);
    socioId = socio.body.data.id;
  });

  after(async () => {
    await ctx.cleanup();
  });

  it('calcula fecha_fin inclusiva: inicio + duracion - 1', async () => {
    const plan = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Mensual Test', precio_centavos: 25000, duracion_dias: 30 })
      .expect(201);

    const mem = await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: plan.body.data.id, fecha_inicio: '2026-09-01' })
      .expect(201);

    assert.equal(mem.body.data.fecha_fin, '2026-09-30');
    assert.equal(mem.body.data.fecha_fin, addDaysInclusiveEnd('2026-09-01', 30));
    assert.equal(mem.body.data.plan_nombre, 'Mensual Test');
    assert.equal(mem.body.data.precio_centavos, 25000);
    assert.equal(mem.body.data.duracion_dias, 30);
  });

  it('rechaza solapamiento de periodos del mismo socio', async () => {
    const plan = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Otro', precio_centavos: 1000, duracion_dias: 10 })
      .expect(201);

    const res = await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: plan.body.data.id, fecha_inicio: '2026-09-15' })
      .expect(409);

    assert.equal(res.body.error.code, 'CONFLICT');
  });

  it('rechaza plan inactivo y plan/socio inexistente', async () => {
    const plan = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Inactivo', precio_centavos: 500, duracion_dias: 5 })
      .expect(201);

    await request(ctx.app)
      .patch(`/api/planes/${plan.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activo: false })
      .expect(200);

    const inactive = await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: plan.body.data.id, fecha_inicio: '2027-01-01' })
      .expect(409);
    assert.equal(inactive.body.error.code, 'CONFLICT');

    const missingPlan = await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: 99999, fecha_inicio: '2027-01-01' })
      .expect(404);
    assert.equal(missingPlan.body.error.code, 'NOT_FOUND');

    const missingSocio = await request(ctx.app)
      .post('/api/socios/99999/membresias')
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: plan.body.data.id, fecha_inicio: '2027-01-01' })
      .expect(404);
    assert.equal(missingSocio.body.error.code, 'NOT_FOUND');
  });

  it('editar un plan no modifica membresías ya asignadas', async () => {
    const plan = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Snapshot', precio_centavos: 9000, duracion_dias: 14 })
      .expect(201);

    const mem = await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: plan.body.data.id, fecha_inicio: '2027-02-01' })
      .expect(201);

    await request(ctx.app)
      .patch(`/api/planes/${plan.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Snapshot Editado', precio_centavos: 12000, duracion_dias: 21 })
      .expect(200);

    const hist = await request(ctx.app)
      .get(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const assigned = hist.body.data.find((m) => m.id === mem.body.data.id);
    assert.equal(assigned.plan_nombre, 'Snapshot');
    assert.equal(assigned.precio_centavos, 9000);
    assert.equal(assigned.duracion_dias, 14);
    assert.equal(assigned.fecha_fin, '2027-02-14');
  });

  it('bloquea eliminar plan referenciado y permite eliminar sin referencias', async () => {
    const used = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Usado', precio_centavos: 100, duracion_dias: 3 })
      .expect(201);

    await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: used.body.data.id, fecha_inicio: '2027-05-01' })
      .expect(201);

    const conflict = await request(ctx.app)
      .delete(`/api/planes/${used.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(409);
    assert.equal(conflict.body.error.code, 'CONFLICT');

    const free = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Libre', precio_centavos: 100, duracion_dias: 3 })
      .expect(201);

    await request(ctx.app)
      .delete(`/api/planes/${free.body.data.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
