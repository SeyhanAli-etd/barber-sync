// backend/src/controllers/appointment.controller.js
const Appointment = require('../models/appointment.model');
const BarberProfile = require('../models/barberProfile.model');
const Service = require('../models/service.model');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Customers only)
exports.createAppointment = async (req, res) => {
  try {
    const { barber_id, service_id, appointment_time, notes } = req.body;
    const customer_id = req.user.id; // from authMiddleware

    // --- Temel Doğrulama ---
    if (!barber_id || !appointment_time || !service_id) {
      return res.status(400).json({ message: 'Berber, hizmet ve randevu zamanı zorunludur.' });
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
    const [barberProfile, service] = await Promise.all([
        BarberProfile.findByUserId(barber_id),
        Service.findById(service_id)
    ]);

    if (!barberProfile || !barberProfile.working_hours) {
      return res.status(404).json({ message: 'Berber profili veya çalışma saatleri bulunamadı.' });
    }
    if (!service) {
        return res.status(404).json({ message: 'Seçilen hizmet bulunamadı.' });
    }

    const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();
    const workingHoursToday = barberProfile.working_hours[dayOfWeek];

    if (!workingHoursToday || workingHoursToday.toLowerCase() === 'closed') {
      return res.status(400).json({ message: 'Seçilen tarih berberin çalışma günü değildir.' });
    }

    const [startTimeStr, endTimeStr] = workingHoursToday.split('-');
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);

    const appointmentHour = appointmentDate.getUTCHours();
    const appointmentMinute = appointmentDate.getUTCMinutes();

    const appointmentStartMinutes = appointmentHour * 60 + appointmentMinute;
    const openingMinutes = startHour * 60 + startMinute;
    const closingMinutes = endHour * 60 + endMinute;
    const appointmentEndMinutes = appointmentStartMinutes + service.duration_minutes;

    if (appointmentStartMinutes < openingMinutes || appointmentEndMinutes > closingMinutes) {
        return res.status(400).json({ message: `Seçilen saat (${appointmentHour.toString().padStart(2, '0')}:${appointmentMinute.toString().padStart(2, '0')}) berberin çalışma saatleri (${workingHoursToday}) dışındadır veya hizmet süresi sığmamaktadır.` });
    }

    // --- Randevu Oluşturma ---
    const newAppointment = await Appointment.create({
      customer_id,
      barber_id,
      service_id,
      appointment_time,
      notes,
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   POST /api/appointments/:id/complete
// @desc    Mark an appointment as completed and log the service/price
// @access  Private (Barbers only)
exports.completeAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;
    const { service_id, final_price } = req.body;
    const barberId = req.user.id;

    // 1. Girdi doğrulaması
    if (!service_id) {
      return res.status(400).json({ message: 'Yapılan hizmeti belirtmek için service_id zorunludur.' });
    }

    // 2. Gerekli kaynakları bul (randevu ve hizmet)
    const [appointment, service] = await Promise.all([
      Appointment.findById(appointmentId),
      Service.findById(service_id)
    ]);

    // 3. Doğrulama ve Yetkilendirme
    if (!appointment) {
      return res.status(404).json({ message: 'Randevu bulunamadı.' });
    }
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    }

    // Sahiplik kontrolü
    if (appointment.barber_id !== barberId || service.barber_id !== barberId) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    // Durum kontrolü: Sadece onaylanmış randevular tamamlanabilir
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ message: `Sadece 'confirmed' durumundaki randevular tamamlanabilir. Bu randevunun durumu: '${appointment.status}'.` });
    }

    // 4. Nihai fiyatı belirle (eğer istekte gelmezse hizmetin standart fiyatını kullan)
    const priceToLog = final_price !== undefined ? final_price : service.price;

    // 5. Randevuyu tamamla
    const completedAppointment = await Appointment.complete(appointmentId, { finalPrice: priceToLog, serviceName: service.name });
    res.json(completedAppointment);
  } catch (error) {
    console.error('Randevu tamamlama hatası:', error);
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

    // --- 6. Müşteriye Anlık Bildirim Gönder ---
    const io = req.app.get('io');
    const customerId = updatedAppointment.customer_id;
    io.to(customerId).emit('appointment_update', {
      message: `Berber, randevunuzun durumunu '${status}' olarak güncelledi.`,
      appointment: updatedAppointment
    });

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

// @route   GET /api/appointments/my-appointments
// @desc    Get all appointments for the logged-in customer
// @access  Private (Customers only)
exports.getCustomerAppointments = async (req, res) => {
  try {
    const customerId = req.user.id; // from authMiddleware

    const appointments = await Appointment.findForCustomer(customerId);

    res.json(appointments);
  } catch (error) {
    console.error('Müşteri randevularını getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};