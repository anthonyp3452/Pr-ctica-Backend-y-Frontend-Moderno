const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Variable de entorno obligatoria ausente: ${name}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV || 'development';

function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    if (nodeEnv === 'production') {
      throw new Error('JWT_SECRET es obligatorio en producción');
    }
    return 'dev_only_change_me';
  }
  if (
    nodeEnv === 'production' &&
    (secret === 'cambia_este_secreto_en_local' || secret === 'dev_only_change_me')
  ) {
    throw new Error('JWT_SECRET de ejemplo no permitido en producción');
  }
  return secret;
}

const config = {
  port: Number(required('PORT', '3000')),
  frontendOrigin: required('FRONTEND_ORIGIN', 'http://localhost:5173'),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '8h'),
  sqlitePath: path.resolve(
    __dirname,
    '..',
    required('SQLITE_PATH', './data/gymcontrol.sqlite')
  ),
  gymTimezone: required('GYM_TIMEZONE', 'America/Guatemala'),
  nodeEnv,
};

module.exports = { config };
