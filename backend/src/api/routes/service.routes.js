const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const serviceController = require('../../controllers/service.controller');

const barberOnly = [authMiddleware, roleMiddleware('barber')];

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Barbers only)
router.post('/', barberOnly, serviceController.createService);

// @route   GET /api/services
// @desc    Get all services for the logged-in barber
// @access  Private (Barbers only)
router.get('/', barberOnly, serviceController.getMyServices);

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Barbers only)
router.put('/:id', barberOnly, serviceController.updateService);

// @route   DELETE /api/services/:id
// @desc    Delete a service (soft delete)
// @access  Private (Barbers only)
router.delete('/:id', barberOnly, serviceController.deleteService);

module.exports = router;