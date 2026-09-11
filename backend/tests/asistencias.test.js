const { describe, it, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createTestApp } = require('./helpers');
const { setNowProvider, resetNowProvider } = require('../src/utils/clock');
const { todayLocal } = require('../src/utils/dates');
const { config } = require('../src/config');

async function login(app, credentials) {
  const res = await request(app).post('/api/auth/login').send(credentials).expect(200);
  return res.body.data.token;
}

describe('Asistencias y dashboard', () => {
  let ctx;
  let token;
  let socioId;
  let planId;

  before(async () => {
    ctx = await createTestApp();
    token = await login(ctx.app, ctx.credentials);

    const socio = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Asistente',
        correo: 'asistente@example.com',
        telefono: '1',
      })
      .expect(201);
    socioId = socio.body.data.id;

    const plan = await request(ctx.app)
      .post('/api/planes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Plan Asistencia', precio_centavos: 1000, duracion_dias: 30 })
      .expect(201);
    planId = plan.body.data.id;
  });

  after(async () => {
    resetNowProvider();
    await ctx.cleanup();
  });

  beforeEach(() => {
    // Día fijo en zona America/Guatemala: 2026-09-10
    setNowProvider(() => new Date('2026-09-10T18:00:00.000Z'));
  });

  afterEach(() => {
    resetNowProvider();
  });

  it('registra asistencia válida con membresía vigente', async () => {
    await request(ctx.app)
      .post(`/api/socios/${socioId}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: planId, fecha_inicio: '2026-09-01' })
      .expect(201);

    const res = await request(ctx.app)
      .post('/api/asistencias')
      .set('Authorization', `Bearer ${token}`)
      .send({ socio_id: socioId })
      .expect(201);

    assert.equal(res.body.data.socio_id, socioId);
    assert.equal(res.body.data.dia_local, '2026-09-10');
    assert.ok(res.body.data.registrado_en.endsWith('Z'));
  });

  it('rechaza asistencia duplicada del mismo día local', async () => {
    const res = await request(ctx.app)
      .post('/api/asistencias')
      .set('Authorization', `Bearer ${token}`)
      .send({ socio_id: socioId })
      .expect(409);

    assert.equal(res.body.error.code, 'DUPLICATE_ATTENDANCE');
  });

  it('rechaza socio sin membresía vigente', async () => {
    const otro = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Sin Plan',
        correo: 'sinplan@example.com',
        telefono: '2',
      })
      .expect(201);

    const res = await request(ctx.app)
      .post('/api/asistencias')
      .set('Authorization', `Bearer ${token}`)
      .send({ socio_id: otro.body.data.id })
      .expect(409);

    assert.equal(res.body.error.code, 'NO_ACTIVE_MEMBERSHIP');
  });

  it('rechaza membresía vencida', async () => {
    const vencido = await request(ctx.app)
      .post('/api/socios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Vencido',
        correo: 'vencido@example.com',
        telefono: '3',
      })
      .expect(201);

    await request(ctx.app)
      .post(`/api/socios/${vencido.body.data.id}/membresias`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan_id: planId, fecha_inicio: '2026-07-01' })
      .expect(201);

    const res = await request(ctx.app)
      .post('/api/asistencias')
      .set('Authorization', `Bearer ${token}`)
      .send({ socio_id: vencido.body.data.id })
      .expect(409);

    assert.equal(res.body.error.code, 'NO_ACTIVE_MEMBERSHIP');
  });

  it('permite nueva asistencia al cambiar el día local', async () => {
    setNowProvider(() => new Date('2026-09-11T06:00:00.000Z'));
    assert.equal(todayLocal(config.gymTimezone), '2026-09-11');

    const res = await request(ctx.app)
      .post('/api/asistencias')
      .set('Authorization', `Bearer ${token}`)
      .send({ socio_id: socioId })
      .expect(201);

    assert.equal(res.body.data.dia_local, '2026-09-11');
  });

  it('filtra asistencias por socio y rango de fechas', async () => {
    const res = await request(ctx.app)
      .get('/api/asistencias')
      .query({ socio_id: socioId, desde: '2026-09-10', hasta: '2026-09-10' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    assert.equal(res.body.data.length, 1);
    assert.equal(res.body.data[0].dia_local, '2026-09-10');
  });

  it('calcula indicadores del dashboard con datos conocidos', async () => {
    setNowProvider(() => new Date('2026-09-10T18:00:00.000Z'));

    const res = await request(ctx.app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // socioId vigente; vencido tiene membresía con fin < hoy; sinplan no cuenta como activo
    assert.equal(res.body.data.socios_activos, 1);
    assert.ok(res.body.data.membresias_vencidas >= 1);
    assert.equal(res.body.data.asistencias_hoy, 1);
    assert.ok(Array.isArray(res.body.data.actividad_reciente));
    assert.ok(res.body.data.actividad_reciente.length >= 1);
  });
});
