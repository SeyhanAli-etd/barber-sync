const BarberProfile = require('../models/barberProfile.model');
const Appointment = require('../models/appointment.model');

// @route   GET /api/barbers
// @desc    Get all barbers with their profiles
// @access  Public
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await BarberProfile.findAll();
    res.json(barbers);
  } catch (error) {
    console.error('Tüm berberleri getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/barbers/:id
// @desc    Get a single barber's profile by their user ID
// @access  Public
exports.getBarberById = async (req, res) => {
  try {
    const barber = await BarberProfile.findByUserId(req.params.id);
    if (!barber) {
      return res.status(404).json({ message: 'Berber bulunamadı.' });
    }
    res.json(barber);
  } catch (error) {
    console.error('Berber profili getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/barbers/:id/availability
// @desc    Get a barber's availability for a specific date
// @access  Public
exports.getBarberAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Tarih sorgu parametresi zorunludur.' });
        }

        const [barberProfile, appointments] = await Promise.all([
            BarberProfile.findByUserId(id),
            Appointment.findByBarberAndDate(id, date)
        ]);

        if (!barberProfile || !barberProfile.working_hours) {
            return res.status(404).json({ message: 'Berber profili veya çalışma saatleri bulunamadı.' });
        }

        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();
        const workingHoursToday = barberProfile.working_hours[dayOfWeek];

        if (!workingHoursToday || workingHoursToday.toLowerCase() === 'closed') {
            return res.json({ availableSlots: [] });
        }

        const [startTimeStr, endTimeStr] = workingHoursToday.split('-');
        const bookedSlots = appointments.map(app => new Date(app.appointment_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }));

        const availableSlots = [];
        let currentTime = new Date(`${date}T${startTimeStr}:00.000Z`);
        const endTime = new Date(`${date}T${endTimeStr}:00.000Z`);

        while (currentTime < endTime) {
            const slotTime = currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
            if (!bookedSlots.includes(slotTime)) {
                availableSlots.push(slotTime);
            }
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        res.json({ availableSlots });
    } catch (error) {
        console.error('Müsaitlik getirme hatası:', error);
        res.status(500).send('Sunucu Hatası');
    }
};