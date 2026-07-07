// backend/src/controllers/profile.controller.js
const BarberProfile = require('../models/barberProfile.model');

// @route   PUT /api/profile/me
// @desc    Create or update the current barber's profile
// @access  Private (Barbers only)
exports.upsertMyBarberProfile = async (req, res) => {
  try {
    const { shop_name, address, working_hours, avatar_url } = req.body;
    const user_id = req.user.id; // from authMiddleware

    const profileData = {
      user_id,
      shop_name,
      address,
      working_hours,
      avatar_url,
    };

    const profile = await BarberProfile.upsert(profileData);
    res.json(profile);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/profile/me
// @desc    Get the current barber's profile
// @access  Private (Barbers only)
exports.getMyBarberProfile = async (req, res) => {
  try {
    const user_id = req.user.id; // from authMiddleware
    const profile = await BarberProfile.findByUserId(user_id);

    if (!profile) {
      // This case should not be hit if the user has the 'barber' role, but it's good practice.
      return res.status(404).json({ message: 'Berber profili bulunamadı.' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};