/** Reloj inyectable para pruebas de zona horaria / cambio de día. */
let nowProvider = () => new Date();

function getNow() {
  return nowProvider();
}

function setNowProvider(fn) {
  nowProvider = fn;
}

function resetNowProvider() {
  nowProvider = () => new Date();
}

module.exports = { getNow, setNowProvider, resetNowProvider };
