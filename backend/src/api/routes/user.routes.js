// backend/src/api/routes/user.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const userController = require('../../controllers/user.controller');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private (All authenticated users)
router.get('/me', authMiddleware, userController.getMe);

module.exports = router;