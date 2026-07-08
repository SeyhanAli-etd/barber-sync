import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyBarberAppointments, updateAppointmentStatus } from '../services/appointmentService';
import CompleteAppointmentModal from '../components/CompleteAppointmentModal';

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return '#28a745'; // green
    case 'pending':
      return '#ffc107'; // yellow
    case 'cancelled':
      return '#dc3545'; // red
    case 'completed':
      return '#17a2b8'; // blue
    default:
      return '#6c757d'; // gray
  }
};

const BarberDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingAppointment, setCompletingAppointment] = useState(null); // For modal
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getMyBarberAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentId, newStatus, token);
      // Update the state locally for instant UI feedback
      setAppointments(prevApps =>
        prevApps.map(app =>
          app.id === appointmentId ? { ...app, status: updatedAppointment.status } : app
        )
      );
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const handleCompleteSuccess = (updatedAppointment) => {
    setAppointments(prevApps =>
      prevApps.map(app =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      )
    );
    setCompletingAppointment(null); // Close modal
  };

  if (loading) return <div>Randevular yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div>
      <h2>Randevu Paneli</h2>
      {completingAppointment && (
        <CompleteAppointmentModal
          appointment={completingAppointment}
          onClose={() => setCompletingAppointment(null)}
          onComplete={handleCompleteSuccess}
        />
      )}
      {appointments.length === 0 ? (
        <p>Henüz randevu talebiniz bulunmamaktadır.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {appointments.map((app) => (
            <li key={app.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Müşteri:</strong> {app.customer_name}</p>
              <p><strong>Tarih:</strong> {new Date(app.appointment_time).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</p>
              <p><strong>Durum:</strong> <span style={{ padding: '4px 8px', borderRadius: '12px', color: 'white', backgroundColor: getStatusColor(app.status) }}>{app.status}</span></p>
              {app.status === 'pending' && (
                <div>
                  <button onClick={() => handleStatusUpdate(app.id, 'confirmed')} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Onayla</button>
                  <button onClick={() => handleStatusUpdate(app.id, 'cancelled')} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>İptal Et</button>
                </div>
              )}
              {app.status === 'confirmed' && (
                <div>
                  <button onClick={() => setCompletingAppointment(app)} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Tamamla</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BarberDashboardPage;