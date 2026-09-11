#!/usr/bin/env node
const { migrate, closeDb } = require('./index');

try {
  migrate();
  console.log('Migraciones aplicadas correctamente.');
} catch (error) {
  console.error('Error al migrar la base de datos:', error.message);
  process.exitCode = 1;
} finally {
  closeDb();
}
