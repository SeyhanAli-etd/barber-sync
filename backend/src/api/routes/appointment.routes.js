const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointment.controller');

// Bu iki middleware dosyasının projenizde var olduğunu varsayıyoruz.
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// @route   POST /api/appointments
// @desc    Create an appointment (customers only)
router.post('/', [authMiddleware, roleMiddleware('customer')], appointmentController.createAppointment);

// @route   GET /api/appointments/my-requests
// @desc    Get all appointments for the logged-in barber (for their dashboard)
router.get('/my-requests', [authMiddleware, roleMiddleware('barber')], appointmentController.getBarberAppointments);

// @route   GET /api/appointments/my-appointments
// @desc    Get user's own appointments (as a customer). Accessible by ANY authenticated user.
// @fix     roleMiddleware('customer') kaldırıldı. Artık berberler de kendi müşteri randevularını görebilir.
router.get('/my-appointments', authMiddleware, appointmentController.getCustomerAppointments);

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status (barbers only)
router.patch('/:id/status', [authMiddleware, roleMiddleware('barber')], appointmentController.updateAppointmentStatus);

// @route   POST /api/appointments/:id/complete
// @desc    Complete an appointment (barbers only)
router.post('/:id/complete', [authMiddleware, roleMiddleware('barber')], appointmentController.completeAppointment);

module.exports = router;