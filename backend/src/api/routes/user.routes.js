// backend/src/api/routes/user.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../../controllers/user.controller');
const upload = require('../middlewares/upload.middleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private (All authenticated users)
router.get('/me', authMiddleware, userController.getMe);

// @route   PUT /api/users/me
// @desc    Update the current user's profile
// @access  Private (All authenticated users)
router.put('/me', authMiddleware, upload.single('avatar'), userController.updateMyProfile);

module.exports = router;