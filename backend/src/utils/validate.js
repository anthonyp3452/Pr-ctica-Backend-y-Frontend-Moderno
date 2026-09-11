const { AppError } = require('./AppError');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isEmail(value) {
  if (!isNonEmptyString(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function requireFields(body, fields) {
  const errors = {};
  for (const field of fields) {
    if (!isNonEmptyString(body?.[field])) {
      errors[field] = 'Campo requerido';
    }
  }
  if (Object.keys(errors).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', errors);
  }
}

module.exports = { isNonEmptyString, isEmail, requireFields };
