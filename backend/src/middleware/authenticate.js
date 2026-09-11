const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { AppError } = require('../utils/AppError');
const { getAuthenticatedUser } = require('../services/authService');

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Token de autenticación requerido');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new AppError(401, 'UNAUTHORIZED', 'Token de autenticación requerido');
    }

    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch {
      throw new AppError(401, 'UNAUTHORIZED', 'Token inválido o expirado');
    }

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new AppError(401, 'UNAUTHORIZED', 'Token inválido o expirado');
    }

    req.user = getAuthenticatedUser(userId);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };
