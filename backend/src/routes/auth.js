const express = require('express');
const { login, getAuthenticatedUser } = require('../services/authService');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const data = await login(req.body || {});
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, (req, res, next) => {
  try {
    const data = getAuthenticatedUser(req.user.id);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
