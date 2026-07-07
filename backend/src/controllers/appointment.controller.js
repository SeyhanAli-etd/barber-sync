// backend/src/controllers/appointment.controller.js
const Appointment = require('../models/appointment.model');
const BarberProfile = require('../models/barberProfile.model');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Customers only)
exports.createAppointment = async (req, res) => {
  try {
    const { barber_id, appointment_time, notes } = req.body;
    const customer_id = req.user.id; // from authMiddleware

    // --- Temel Doğrulama ---
    if (!barber_id || !appointment_time) {
      return res.status(400).json({ message: 'Berber ID ve randevu zamanı zorunludur.' });
    }

    // UUID format kontrolü
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(barber_id)) {
        return res.status(400).json({ message: 'Geçersiz berber ID formatı. Lütfen doğru bir ID kopyaladığınızdan emin olun.' });
    }

    const appointmentDate = new Date(appointment_time);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Geçersiz veya geçmiş bir tarih seçtiniz.' });
    }

    // --- Sunucu Taraflı Müsaitlik Kontrolü ---

    // 1. Slotun zaten dolu olup olmadığını kontrol et (Yarış Durumu Kontrolü)
    const isBooked = await Appointment.isSlotBooked(barber_id, appointment_time);
    if (isBooked) {
      return res.status(409).json({ message: 'Üzgünüz, bu randevu saati az önce alındı. Lütfen başka bir saat seçin.' });
    }

    // 2. Slotun berberin çalışma saatleri içinde olup olmadığını kontrol et
    const barberProfile = await BarberProfile.findByUserId(barber_id);
    if (!barberProfile || !barberProfile.working_hours) {
      return res.status(404).json({ message: 'Berber profili veya çalışma saatleri bulunamadı.' });
    }

    const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHoursToday = barberProfile.working_hours[dayOfWeek];

    if (!workingHoursToday || workingHoursToday.toLowerCase() === 'closed') {
      return res.status(400).json({ message: 'Seçilen tarih berberin çalışma günü değildir.' });
    }

    const [startTimeStr, endTimeStr] = workingHoursToday.split('-');
    const appointmentTimeOnly = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (appointmentTimeOnly < startTimeStr || appointmentTimeOnly >= endTimeStr) {
        return res.status(400).json({ message: 'Seçilen saat berberin çalışma saatleri dışındadır.' });
    }

    // --- Randevu Oluşturma ---
    const newAppointment = await Appointment.create({
      customer_id,
      barber_id,
      appointment_time,
      notes,
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   PATCH /api/appointments/:id/status
// @desc    Update an appointment's status (confirm/cancel)
// @access  Private (Barbers only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { status } = req.body;
    const barberId = req.user.id; // Logged-in user is a barber

    // 1. Girdi doğrulaması
    if (!status || !['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Geçerli bir durum belirtmelisiniz: 'confirmed' veya 'cancelled'." });
    }

    // 2. Randevuyu bul
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı.' });
    }

    // 3. Yetkilendirme Kontrolü: Bu berber, randevunun sahibi mi?
    if (appointment.barber_id !== barberId) {
      return res.status(403).json({ message: 'Bu randevuyu değiştirme yetkiniz yok.' });
    }

    // 4. Zaten tamamlanmış/iptal edilmiş bir randevunun durumunu değiştirmeyi engelle
    if (['completed', 'cancelled'].includes(appointment.status)) {
        return res.status(400).json({ message: `Bu randevu zaten '${appointment.status}' durumunda, değiştirilemez.` });
    }

    // 5. Durumu güncelle
    const updatedAppointment = await Appointment.updateStatus(appointmentId, status);

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Randevu durumu güncelleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/appointments/my-requests
// @desc    Get all appointments for the logged-in barber
// @access  Private (Barbers only)
exports.getBarberAppointments = async (req, res) => {
  try {
    const barberId = req.user.id; // from authMiddleware

    const appointments = await Appointment.findForBarber(barberId);

    res.json(appointments);
  } catch (error) {
    console.error('Berber randevularını getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};