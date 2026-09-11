const { createApp } = require('./app');
const { config } = require('./config');

const app = createApp();

app.listen(config.port, () => {
  console.log(`GymControl API escuchando en http://localhost:${config.port}`);
  console.log(`CORS habilitado para ${config.frontendOrigin}`);
});
