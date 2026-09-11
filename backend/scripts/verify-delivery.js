#!/usr/bin/env node
/**
 * Verificación de entrega del backend (sin secretos en la salida).
 * Comprueba health público, rechazo 401 en rutas privadas y login + /me.
 */
const assert = require('node:assert/strict');
const request = require('supertest');
const { createTestApp } = require('../tests/helpers');

const PRIVATE_GET = [
  '/api/auth/me',
  '/api/dashboard',
  '/api/socios',
  '/api/planes',
  '/api/asistencias',
];

async function main() {
  const ctx = await createTestApp();
  const results = [];

  try {
    const health = await request(ctx.app).get('/api/health').expect(200);
    assert.equal(health.body.data.status, 'ok');
    results.push('OK GET /api/health (público)');

    for (const path of PRIVATE_GET) {
      const res = await request(ctx.app).get(path).expect(401);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
      assert.equal(res.body.data, undefined);
      assert.equal(res.body.error && res.body.password, undefined);
      results.push(`OK 401 sin token en ${path}`);
    }

    const login = await request(ctx.app)
      .post('/api/auth/login')
      .send(ctx.credentials)
      .expect(200);

    assert.ok(login.body.data.token);
    assert.equal(login.body.data.usuario.password_hash, undefined);
    assert.equal(login.body.data.usuario.password, undefined);
    results.push('OK login no expone hash ni password');

    const me = await request(ctx.app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .expect(200);
    assert.equal(me.body.data.correo, ctx.credentials.correo);
    results.push('OK GET /api/auth/me con JWT');

    const emptyLogin = await request(ctx.app)
      .post('/api/auth/login')
      .send({})
      .expect(400);
    assert.equal(emptyLogin.body.error.code, 'VALIDATION_ERROR');
    results.push('OK validación de login');

    console.log('Verificación de entrega backend: PASS');
    for (const line of results) {
      console.log(` - ${line}`);
    }
  } finally {
    await ctx.cleanup();
  }
}

main().catch((error) => {
  console.error('Verificación de entrega backend: FAIL');
  console.error(error.message);
  process.exitCode = 1;
});
