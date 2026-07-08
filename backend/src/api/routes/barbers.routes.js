// backend/src/api/routes/barbers.routes.js
const express = require('express');
const router = express.Router();
const barberController = require('../../controllers/barber.controller');

// @route   GET /api/barbers
// @desc    Get all barbers with their profiles
// @access  Public
router.get('/', barberController.getAllBarbers);

// @route   GET /api/barbers/:id
// @desc    Get a single barber's profile by user ID
// @access  Public
router.get('/:id', barberController.getBarberById);

// @route   GET /api/barbers/:id/availability
// @desc    Get a barber's availability for a specific date
// @access  Public
router.get('/:id/availability', barberController.getBarberAvailability);

module.exports = router;