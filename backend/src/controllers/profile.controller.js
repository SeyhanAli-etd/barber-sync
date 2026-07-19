// backend/src/controllers/profile.controller.js
const BarberProfile = require('../models/barberProfile.model');
const User = require('../models/user.model');

// @route   PUT /api/profile/me
// @desc    Create or update the current barber's profile
// @access  Private (Barbers only)
exports.upsertMyBarberProfile = async (req, res) => {
  try {
    const { shop_name, address, working_hours, latitude, longitude } = req.body;
    const user_id = req.user.id;

    // FormData'dan gelen working_hours string olabilir, JSON'a çevir.
    const parsedWorkingHours = typeof working_hours === 'string' ? JSON.parse(working_hours) : working_hours;

    // 1. Avatarı SADECE yeni bir dosya varsa güncelle
    if (req.file) {
      const relative_path = `uploads/${req.file.filename}`;
      await User.update(user_id, { avatar_url: relative_path });
    }

    // 2. Profil Bilgilerini Güncelle
    const profileData = {
      user_id,
      shop_name: shop_name || null,
      address: address || null,
      working_hours: parsedWorkingHours,
      latitude: latitude || null,
      longitude: longitude || null,
    };
    await BarberProfile.upsert(profileData);

    // 3. Güncel ve birleştirilmiş profili çekip arayüze gönder.
    const fullProfile = await BarberProfile.findByUserId(user_id);
    res.json(fullProfile);
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

// @route   POST /api/profile/gallery
// @desc    Add a photo to the current barber's gallery
// @access  Private (Barbers only)
exports.addPhotoToGallery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Lütfen bir resim dosyası seçin.' });
    }

    // DÜZELTME: req.file.path yerine göreli yol kullan.
    const imageUrl = `uploads/${req.file.filename}`;

    const description = req.body.description || '';

    const photo = await BarberProfile.addGalleryPhoto(req.user.id, imageUrl, description);

    res.status(201).json(photo);
  } catch (error) {
    console.error('Galeriye fotoğraf ekleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};