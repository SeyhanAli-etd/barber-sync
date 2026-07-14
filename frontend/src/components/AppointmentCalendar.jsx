import React, { useState, useEffect } from 'react';
import { getBarberAvailability } from '../services/barberService';
import { createAppointment } from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';
import './AppointmentCalendar.css';

// Helper to format date to YYYY-MM-DD
const toYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AppointmentCalendar = ({ barber, service, onAppointmentBooked }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError('');
      setSelectedSlot(null);
      try {
        const dateStr = toYYYYMMDD(selectedDate);
        const data = await getBarberAvailability(barber.id, dateStr, service.duration_minutes);
        setAvailability(data.availableSlots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate, barber.id, service.duration_minutes]);

  const handleDateChange = (e) => {
    // Create a new Date object in the local timezone to avoid timezone issues
    const [year, month, day] = e.target.value.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
  };

  const handleConfirmAppointment = async () => {
    setError('');
    setBookingLoading(true);

    try {
      const appointmentTime = `${toYYYYMMDD(selectedDate)}T${selectedSlot}:00.000Z`;
      const appointmentData = {
        barber_id: barber.id,
        appointment_time: appointmentTime,
        service_id: service.id,
      };
      await createAppointment(appointmentData);
      onAppointmentBooked(); // Notify parent component
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="date-picker-wrapper">
        <label htmlFor="date-picker">Tarih:</label>
        <input type="date" id="date-picker" value={toYYYYMMDD(selectedDate)} onChange={handleDateChange} min={toYYYYMMDD(new Date())} />
      </div>
      
      {loading && <p>Müsaitlik kontrol ediliyor...</p>}
      {error && !loading && <p className="error-message">{error}</p>}
      
      {!loading && availability.length === 0 && <p>Seçili tarih için müsait randevu saati bulunmamaktadır.</p>}
      
      <div className="slots-grid">
        {availability.map((slot) => (<button key={slot} className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`} onClick={() => setSelectedSlot(slot)} disabled={bookingLoading}>{slot}</button>))}
      </div>

      {selectedSlot && (
        <button className="confirm-btn" onClick={handleConfirmAppointment} disabled={bookingLoading}>
          {bookingLoading ? 'Onaylanıyor...' : `${selectedSlot} için Randevuyu Onayla`}
        </button>
      )}
    </div>
  );
};

export default AppointmentCalendar;