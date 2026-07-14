const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const reviewController = require('../../controllers/review.controller');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Customers only)
router.post('/', authMiddleware, roleMiddleware('customer'), reviewController.createReview);

// @route   GET /api/reviews/barber/:barberId
// @desc    Get all reviews for a barber
// @access  Public
router.get('/barber/:barberId', reviewController.getBarberReviews);

module.exports = router;