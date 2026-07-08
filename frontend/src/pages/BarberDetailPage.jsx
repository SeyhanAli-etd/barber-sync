import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBarberById } from '../services/barberService';
import AppointmentCalendar from '../components/AppointmentCalendar';

const BarberDetailPage = () => {
  const { id } = useParams(); // Get barber ID from URL
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const data = await getBarberById(id);
        setBarber(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBarber();
  }, [id]);

  if (loading) return <div>Berber profili yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;
  if (!barber) return <div>Berber bulunamadı.</div>;

  return (
    <div>
      <h1>{barber.shop_name || barber.full_name}</h1>
      <p><strong>Adres:</strong> {barber.address || 'Belirtilmemiş'}</p>
      <hr />
      <h2>Randevu Al</h2>
      <AppointmentCalendar barberId={id} />
    </div>
  );
};

export default BarberDetailPage;