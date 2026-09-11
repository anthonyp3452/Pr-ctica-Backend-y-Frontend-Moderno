const express = require('express');
const cors = require('cors');
const { config } = require('./config');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const sociosRouter = require('./routes/socios');
const planesRouter = require('./routes/planes');
const membresiasRouter = require('./routes/membresias');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { authenticate } = require('./middleware/authenticate');
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
  app.use('/api/socios/:id/membresias', authenticate, membresiasRouter);
  app.use('/api/socios', authenticate, sociosRouter);
  app.use('/api/planes', authenticate, planesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
