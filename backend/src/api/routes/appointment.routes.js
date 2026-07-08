// backend/src/api/routes/appointment.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const appointmentController = require('../../controllers/appointment.controller');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Customers only)
router.post(
  '/',
  [authMiddleware, roleMiddleware('customer')],
  appointmentController.createAppointment
);

// @route   PATCH /api/appointments/:id/status
// @desc    Update an appointment's status (confirm/cancel)
// @access  Private (Barbers only)
router.patch(
  '/:id/status',
  [authMiddleware, roleMiddleware('barber')],
  appointmentController.updateAppointmentStatus
);

// @route   GET /api/appointments/my-requests
// @desc    Get all appointments for the logged-in barber
// @access  Private (Barbers only)
router.get(
  '/my-requests',
  [authMiddleware, roleMiddleware('barber')],
  appointmentController.getBarberAppointments
);

// @route   GET /my-appointments
// @desc    Get all appointments for the logged-in customer
// @access  Private (Customers only)
router.get(
  '/my-appointments',
  [authMiddleware, roleMiddleware('customer')],
  appointmentController.getCustomerAppointments
);


// @route   POST /api/appointments/:id/complete
// @desc    Mark an appointment as completed
// @access  Private (Barbers only)
router.post(
  '/:id/complete',
  [authMiddleware, roleMiddleware('barber')],
  appointmentController.completeAppointment
);

module.exports = router;