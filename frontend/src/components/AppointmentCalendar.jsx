import React, { useState, useEffect } from 'react';
import { getBarberAvailability } from '../services/barberService';
import { createAppointment } from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';

// Helper to format date to YYYY-MM-DD
const toYYYYMMDD = (date) => {
  return date.toISOString().split('T')[0];
};

const AppointmentCalendar = ({ barberId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const dateStr = toYYYYMMDD(selectedDate);
        const data = await getBarberAvailability(barberId, dateStr);
        setAvailability(data.availableSlots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate, barberId]);

  const handleDateChange = (e) => {
    // Add a day to the selected date to correct for timezone issues with date input
    const date = new Date(e.target.value);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    setSelectedDate(new Date(date.getTime() + userTimezoneOffset));
  };

  const handleSlotClick = async (slot) => {
    if (!window.confirm(`${toYYYYMMDD(selectedDate)} ${slot} için randevu almak istediğinizden emin misiniz?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const appointmentTime = `${toYYYYMMDD(selectedDate)}T${slot}:00.000Z`;
      const appointmentData = {
        barber_id: barberId,
        appointment_time: appointmentTime,
      };
      await createAppointment(appointmentData, token);
      setSuccess(`Randevunuz başarıyla oluşturuldu: ${toYYYYMMDD(selectedDate)} ${slot}`);
      // Refetch availability to remove the booked slot
      const updatedAvailability = availability.filter(s => s !== slot);
      setAvailability(updatedAvailability);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <label htmlFor="date-picker">Tarih Seçin:</label>
      <input type="date" id="date-picker" value={toYYYYMMDD(selectedDate)} onChange={handleDateChange} min={toYYYYMMDD(new Date())} />
      <hr />
      <h4>Müsait Saatler</h4>
      {loading && <p>Müsaitlik kontrol ediliyor...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {!loading && availability.length === 0 && <p>Seçili tarih için müsait randevu saati bulunmamaktadır.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {availability.map((slot) => (<button key={slot} onClick={() => handleSlotClick(slot)} disabled={!!success}>{slot}</button>))}
      </div>
    </div>
  );
};

export default AppointmentCalendar;