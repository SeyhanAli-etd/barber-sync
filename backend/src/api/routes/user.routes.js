// backend/src/api/routes/user.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const userController = require('../../controllers/user.controller');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, userController.getProfile);

// @route   GET /api/users/barber-dashboard
// @desc    A sample route only for barbers
// @access  Private (Barbers only)
router.get(
  '/barber-dashboard',
  [authMiddleware, roleMiddleware('barber')], // Use middlewares in an array
  userController.getBarberDashboard
);

module.exports = router;