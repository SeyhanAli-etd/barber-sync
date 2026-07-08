const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const reportController = require('../../controllers/report.controller');

const barberOnly = [authMiddleware, roleMiddleware('barber')];

// @route   GET /api/reports/revenue
// @desc    Get daily and monthly revenue for the logged-in barber
// @access  Private (Barbers only)
router.get('/revenue', barberOnly, reportController.getRevenueReport);

module.exports = router;