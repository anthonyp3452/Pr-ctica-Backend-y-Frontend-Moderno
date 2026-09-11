const express = require('express');
const {
  listPlanes,
  createPlan,
  updatePlan,
  deletePlan,
} = require('../services/planesService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const data = listPlanes({ activo: req.query.activo });
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const data = createPlan(req.body || {});
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    const data = updatePlan(req.params.id, req.body || {});
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    deletePlan(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
