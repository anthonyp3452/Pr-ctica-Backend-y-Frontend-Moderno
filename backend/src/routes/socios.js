const express = require('express');
const {
  listSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
} = require('../services/sociosService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const data = listSocios({ q: req.query.q });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const data = createSocio(req.body || {});
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const data = getSocioById(req.params.id);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    const data = updateSocio(req.params.id, req.body || {});
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    deleteSocio(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
