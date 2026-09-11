const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { migrate } = require('./db');

function createApp({ migrateOnStart = true } = {}) {
  if (migrateOnStart) {
    migrate();
  }

  const app = express();

  app.use(
    cors({
      origin: config.frontendOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
