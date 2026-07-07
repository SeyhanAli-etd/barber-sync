// backend/src/api/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const profileController = require('../../controllers/profile.controller');

// @route   GET /api/profile/me
// @desc    Get the current user's (barber) profile
// @access  Private (Barbers only)
router.get('/me', [authMiddleware, roleMiddleware('barber')], profileController.getMyBarberProfile);

// @route   PUT /api/profile/me
// @desc    Create or update the current user's (barber) profile
// @access  Private (Barbers only)
router.put(
  '/me',
  [authMiddleware, roleMiddleware('barber')],
  profileController.upsertMyBarberProfile
);

module.exports = router;