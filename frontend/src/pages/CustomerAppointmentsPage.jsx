import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyCustomerAppointments } from '../services/appointmentService';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return '#28a745';
    case 'pending': return '#ffc107';
    case 'cancelled': return '#dc3545';
    case 'completed': return '#17a2b8';
    default: return '#6c757d';
  }
};

const CustomerAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getMyCustomerAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  if (loading) return <div>Randevularınız yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div>
      <h2>Randevularım</h2>
      {appointments.length === 0 ? (
        <p>Henüz bir randevunuz bulunmamaktadır.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {appointments.map((app) => (
            <li key={app.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Berber:</strong> {app.barber_name} ({app.shop_name || 'Dükkan Adı Yok'})</p>
              <p><strong>Tarih:</strong> {new Date(app.appointment_time).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</p>
              <p><strong>Durum:</strong> <span style={{ padding: '4px 8px', borderRadius: '12px', color: 'white', backgroundColor: getStatusColor(app.status) }}>{app.status}</span></p>
              {app.notes && <p><strong>Notunuz:</strong> {app.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerAppointmentsPage;