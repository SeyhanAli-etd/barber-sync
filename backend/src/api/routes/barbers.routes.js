// backend/src/api/routes/barbers.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

// @route   GET /api/barbers
// @desc    Get all barbers with their profiles
// @access  Public
router.get('/', userController.getBarbers);

// @route   GET /api/barbers/:id
// @desc    Get a single barber profile by user ID
// @access  Public
router.get('/:id', userController.getBarberById);

// @route   GET /api/barbers/:id/availability
// @desc    Get available appointment slots for a barber on a given date
// @access  Public
router.get('/:id/availability', userController.getBarberAvailability);

module.exports = router;