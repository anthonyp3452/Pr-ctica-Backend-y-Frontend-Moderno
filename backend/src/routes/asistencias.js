const express = require('express');
const {
  listAsistencias,
  registrarAsistencia,
} = require('../services/asistenciasService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const data = listAsistencias({
      socio_id: req.query.socio_id,
      desde: req.query.desde,
      hasta: req.query.hasta,
    });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const data = registrarAsistencia(req.body || {});
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
