const express = require('express');
const {
  listMembresiasBySocio,
  assignMembresia,
} = require('../services/membresiasService');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  try {
    const data = listMembresiasBySocio(req.params.id);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const data = assignMembresia(req.params.id, req.body || {});
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
