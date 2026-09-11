const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Variable de entorno obligatoria ausente: ${name}`);
  }
  return value;
}

const config = {
  port: Number(required('PORT', '3000')),
  frontendOrigin: required('FRONTEND_ORIGIN', 'http://localhost:5173'),
  jwtSecret: required('JWT_SECRET', 'dev_only_change_me'),
  jwtExpiresIn: required('JWT_EXPIRES_IN', '8h'),
  sqlitePath: path.resolve(
    __dirname,
    '..',
    required('SQLITE_PATH', './data/gymcontrol.sqlite')
  ),
  gymTimezone: required('GYM_TIMEZONE', 'America/Guatemala'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = { config };
