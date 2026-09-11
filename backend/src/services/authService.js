const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { getDb } = require('../db');
const { AppError } = require('../utils/AppError');
const { requireFields, isEmail } = require('../utils/validate');

const SALT_ROUNDS = 10;

function publicUser(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
  };
}

function findByCorreo(correo) {
  return getDb()
    .prepare('SELECT id, nombre, correo, password_hash FROM usuarios WHERE correo = ? COLLATE NOCASE')
    .get(correo.trim());
}

function findById(id) {
  return getDb()
    .prepare('SELECT id, nombre, correo, password_hash FROM usuarios WHERE id = ?')
    .get(id);
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function login({ correo, password }) {
  requireFields({ correo, password }, ['correo', 'password']);

  if (!isEmail(correo)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', {
      correo: 'Correo inválido',
    });
  }

  const user = findByCorreo(correo);
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Correo o contraseña incorrectos');
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Correo o contraseña incorrectos');
  }

  const token = jwt.sign(
    { sub: user.id, correo: user.correo },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return { token, usuario: publicUser(user) };
}

function getAuthenticatedUser(userId) {
  const user = findById(userId);
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Usuario no autenticado');
  }
  return publicUser(user);
}

module.exports = {
  login,
  getAuthenticatedUser,
  hashPassword,
  findByCorreo,
  publicUser,
};
