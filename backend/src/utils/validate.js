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

function parseId(value, label = 'id') {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido', {
      [label]: 'Debe ser un entero positivo',
    });
  }
  return id;
}

function validateSocioPayload(body, { partial = false } = {}) {
  const errors = {};
  const data = {};

  if (!partial || body.nombre !== undefined) {
    if (!isNonEmptyString(body?.nombre)) {
      errors.nombre = 'Campo requerido';
    } else {
      const nombre = body.nombre.trim();
      if (nombre.length < 2 || nombre.length > 120) {
        errors.nombre = 'Debe tener entre 2 y 120 caracteres';
      } else {
        data.nombre = nombre;
      }
    }
  }

  if (!partial || body.correo !== undefined) {
    if (!isNonEmptyString(body?.correo)) {
      errors.correo = 'Campo requerido';
    } else if (!isEmail(body.correo)) {
      errors.correo = 'Correo inválido';
    } else {
      data.correo = body.correo.trim().toLowerCase();
    }
  }

  if (!partial || body.telefono !== undefined) {
    const telefono = body?.telefono == null ? '' : String(body.telefono).trim();
    if (telefono.length > 30) {
      errors.telefono = 'Máximo 30 caracteres';
    } else {
      data.telefono = telefono;
    }
  } else if (!partial) {
    data.telefono = '';
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada inválidos', errors);
  }

  if (partial && Object.keys(data).length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'No hay campos para actualizar', {});
  }

  return data;
}

module.exports = {
  isNonEmptyString,
  isEmail,
  requireFields,
  parseId,
  validateSocioPayload,
};
