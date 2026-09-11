function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      fields: {},
    },
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message || 'Error interno del servidor';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code,
      message,
      fields: err.fields || {},
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
