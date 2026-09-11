const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { createTestApp } = require('./helpers');

describe('Autenticación', () => {
  let ctx;

  before(async () => {
    ctx = await createTestApp();
  });

  after(async () => {
    await ctx.cleanup();
  });

  it('login válido devuelve token y usuario sin hash', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .send(ctx.credentials)
      .expect(200);

    assert.ok(res.body.data.token);
    assert.equal(res.body.data.usuario.correo, 'admin@test.local');
    assert.equal(res.body.data.usuario.password_hash, undefined);
    assert.equal(res.body.data.usuario.password, undefined);
  });

  it('login con contraseña incorrecta responde 401', async () => {
    const res = await request(ctx.app)
      .post('/api/auth/login')
      .send({ correo: ctx.credentials.correo, password: 'incorrecta' })
      .expect(401);

    assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
  });

  it('login sin campos requeridos responde 400', async () => {
    const res = await request(ctx.app).post('/api/auth/login').send({}).expect(400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    assert.ok(res.body.error.fields.correo);
    assert.ok(res.body.error.fields.password);
  });

  it('GET /auth/me sin token responde 401', async () => {
    const res = await request(ctx.app).get('/api/auth/me').expect(401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /auth/me con token válido responde el usuario', async () => {
    const login = await request(ctx.app)
      .post('/api/auth/login')
      .send(ctx.credentials)
      .expect(200);

    const res = await request(ctx.app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .expect(200);

    assert.equal(res.body.data.correo, 'admin@test.local');
    assert.equal(res.body.data.password_hash, undefined);
  });

  it('GET /auth/me con token alterado responde 401', async () => {
    const login = await request(ctx.app)
      .post('/api/auth/login')
      .send(ctx.credentials)
      .expect(200);

    const tampered = `${login.body.data.token}x`;
    const res = await request(ctx.app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tampered}`)
      .expect(401);

    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('GET /auth/me con token expirado responde 401', async () => {
    const { config } = require('../src/config');
    const expired = jwt.sign(
      { sub: 1, correo: 'admin@test.local' },
      config.jwtSecret,
      { expiresIn: -10 }
    );

    const res = await request(ctx.app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expired}`)
      .expect(401);

    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });
});
