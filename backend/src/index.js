const { createApp } = require('./app');
const { config } = require('./config');

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`GymControl API escuchando en http://localhost:${config.port}`);
  console.log(`CORS habilitado para ${config.frontendOrigin}`);
});

server.on('error', (error) => {
  console.error('No se pudo iniciar la API:', error.message);
  process.exitCode = 1;
});

// Mantiene la API viva en entornos que liberan el servidor tras la inicialización.
setInterval(() => {}, 60_000);
