const Review = require('../models/review.model');
const Appointment = require('../models/appointment.model');

// @route   POST /api/reviews
// @desc    Create a new review for an appointment
// @access  Private (Customers only)
exports.createReview = async (req, res) => {
  try {
    const { appointment_id, rating, comment } = req.body;
    const customer_id = req.user.id;

    // 1. Girdi doğrulaması
    if (!appointment_id || !rating) {
      return res.status(400).json({ message: 'Randevu ID ve puan zorunludur.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Puan 1 ile 5 arasında olmalıdır.' });
    }

    // 2. Gerekli kaynakları bul
    const appointment = await Appointment.findById(appointment_id);

    // 3. Doğrulama ve Yetkilendirme
    if (!appointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı.' });
    }

    // Sahiplik kontrolü: Sadece kendi randevusuna yorum yapabilir
    if (appointment.customer_id !== customer_id) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    // Durum kontrolü: Sadece tamamlanmış randevulara yorum yapılabilir
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Sadece tamamlanmış randevulara yorum yapabilirsiniz.' });
    }

    // Tekrar kontrolü: Bu randevu için zaten bir yorum yapılmış mı?
    const reviewExists = await Review.existsForAppointment(appointment_id);
    if (reviewExists) {
      return res.status(409).json({ message: 'Bu randevu için zaten bir yorum yapılmış.' });
    }

    // 4. Yorumu oluştur
    const newReview = await Review.create({
      appointment_id,
      customer_id,
      barber_id: appointment.barber_id,
      rating,
      comment,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/reviews/barber/:barberId
// @desc    Get all reviews for a specific barber
// @access  Public
exports.getBarberReviews = async (req, res) => {
  try {
    const { barberId } = req.params;
    const reviews = await Review.findByBarberId(barberId);
    res.json(reviews);
  } catch (error) {
    console.error('Berber yorumlarını getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};