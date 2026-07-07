// backend/src/controllers/user.controller.js
const User = require('../models/user.model');
const BarberProfile = require('../models/barberProfile.model');
const Appointment = require('../models/appointment.model');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Middleware, req.user'ı zaten ekledi.
    // Şifre hash'i gibi hassas bilgileri göndermemek için veritabanından tekrar çekiyoruz.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Şifre hash'ini cevaptan çıkar
    const { password_hash, ...userProfile } = user;

    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/barbers/:id/availability
// @desc    Get available appointment slots for a barber on a given date
// @access  Public
exports.getBarberAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Tarih sorgu parametresi zorunludur (örn: ?date=YYYY-MM-DD).' });
    }

    // 1. Berberin profilini ve mevcut randevularını aynı anda çek
    const [barberProfile, bookedAppointments] = await Promise.all([
      BarberProfile.findByUserId(id),
      Appointment.findByBarberAndDate(id, date)
    ]);

    if (!barberProfile || !barberProfile.working_hours) {
      return res.status(404).json({ message: 'Berber profili veya çalışma saatleri bulunamadı.' });
    }

    // 2. İstenen gün için çalışma saatlerini belirle
    const requestedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = requestedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHoursToday = barberProfile.working_hours[dayOfWeek];

    if (!workingHoursToday || workingHoursToday.toLowerCase() === 'closed') {
      return res.json([]); // Çalışma günü değilse boş dizi döndür
    }

    // 3. Olası tüm randevu saatlerini oluştur
    const [startTimeStr, endTimeStr] = workingHoursToday.split('-');
    const slotDuration = 30; // Randevu süresi (dakika)
    const allSlots = [];

    const startDate = new Date(`${date}T${startTimeStr}:00`);
    const endDate = new Date(`${date}T${endTimeStr}:00`);
    let currentSlot = new Date(startDate);

    while (currentSlot < endDate) {
      allSlots.push(currentSlot.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
      currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
    }

    // 4. Dolu saatleri bir set'e ekle (hızlı arama için)
    const bookedSlots = new Set();
    bookedAppointments.forEach(app => {
      bookedSlots.add(new Date(app.appointment_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    });

    // 5. Müsait saatleri filtrele
    const availableSlots = allSlots.filter(slot => !bookedSlots.has(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error('Müsaitlik getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/users/barber-dashboard
// @desc    Get data for barber dashboard
// @access  Private (Barbers only)
exports.getBarberDashboard = (req, res) => {
  // Since both auth and role middlewares have passed, we know this is a barber.
  res.json({
    success: true,
    message: `Hoş geldin, berber! Bu senin özel panelin.`,
  });
};

// @route   GET /api/barbers
// @desc    Get all barbers with their profiles
// @access  Public
exports.getBarbers = async (req, res) => {
  try {
    const barbers = await BarberProfile.findAll();
    res.json(barbers);
  } catch (error) {
    console.error('Berberleri listeleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/barbers/:id
// @desc    Get a single barber profile by user ID
// @access  Public
exports.getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    const barberProfile = await BarberProfile.findByUserId(id);

    if (!barberProfile) {
      return res.status(404).json({ message: 'Berber bulunamadı.' });
    }

    res.json(barberProfile);
  } catch (error) {
    console.error('Berber profili getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};