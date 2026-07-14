const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const reportController = require('../../controllers/report.controller');

// @route   GET /api/reports/revenue
// @desc    Get daily and monthly revenue report
// @access  Private (Barbers only)
router.get('/revenue', authMiddleware, roleMiddleware('barber'), reportController.getRevenueReport);

// @route   GET /api/reports/monthly-summary
// @desc    Get monthly revenue summary for the last 12 months
// @access  Private (Barbers only)
router.get('/monthly-summary', authMiddleware, roleMiddleware('barber'), reportController.getMonthlySummary);

module.exports = router;