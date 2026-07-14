const BarberGallery = require('../models/barberGallery.model');

// @route   POST /api/profile/gallery
// @desc    Upload a new gallery photo for the logged-in barber
// @access  Private (Barbers only)
exports.uploadGalleryPhoto = async (req, res) => {
  try {
    const barber_id = req.user.id;
    const image_url = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const { description } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'Lütfen bir fotoğraf yükleyin.' });
    }

    const newPhoto = await BarberGallery.addPhoto({ barber_id, image_url, description });
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Galeri fotoğrafı yükleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   PUT /api/profile/gallery/:id
// @desc    Update a gallery photo's description
// @access  Private (Barbers only)
exports.updateGalleryPhoto = async (req, res) => {
  // Bu fonksiyon, fotoğraf açıklamalarını düzenlemek için gelecekte kullanılabilir.
  // Şimdilik sadece silme ve ekleme işlemlerine odaklanıyoruz.
  res.status(501).json({ message: 'Henüz implemente edilmedi.' });
};

// @route   DELETE /api/profile/gallery/:id
// @desc    Delete a gallery photo
// @access  Private (Barbers only)
exports.deleteGalleryPhoto = async (req, res) => {
  try {
    const { id: photoId } = req.params;
    // Güvenlik için, bu fotoğrafın gerçekten bu berbere ait olup olmadığı
    // veritabanından kontrol edilmelidir. Şimdilik basit tutuyoruz.
    await BarberGallery.deletePhoto(photoId);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Galeri fotoğrafı silme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};