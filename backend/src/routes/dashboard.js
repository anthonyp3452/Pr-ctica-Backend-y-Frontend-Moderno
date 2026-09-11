const express = require('express');
const { getDashboard } = require('../services/dashboardService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const data = getDashboard();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
