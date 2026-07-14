const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware'); // Multer upload middleware
const barberGalleryController = require('../../controllers/barberGallery.controller');

// @route   POST /api/profile/gallery
// @desc    Upload a new gallery photo for the logged-in barber
// @access  Private (Barbers only)
router.post('/', authMiddleware, roleMiddleware('barber'), upload.single('image'), barberGalleryController.uploadGalleryPhoto);

// @route   PUT /api/profile/gallery/:id
// @desc    Update a gallery photo's description
// @access  Private (Barbers only)
router.put('/:id', authMiddleware, roleMiddleware('barber'), barberGalleryController.updateGalleryPhoto);

// @route   DELETE /api/profile/gallery/:id
// @desc    Delete a gallery photo
// @access  Private (Barbers only)
router.delete('/:id', authMiddleware, roleMiddleware('barber'), barberGalleryController.deleteGalleryPhoto);

module.exports = router;