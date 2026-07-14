import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyBarberAppointments, updateAppointmentStatus } from '../services/appointmentService';
import CompleteAppointmentModal from '../components/CompleteAppointmentModal';
import './ListPage.css';

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return '#a5d6a7'; // light green
    case 'pending':
      return '#fff59d'; // light yellow
    case 'cancelled':
      return '#ef9a9a'; // light red
    case 'completed':
      return '#81d4fa'; // light blue
    default:
      return '#bdbdbd'; // light gray
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
    <div className="list-page">
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
        <ul className="list-container">
          {appointments.map((app) => (
            <li key={app.id} className="list-item-card">
              <div>
                <p><strong>Müşteri:</strong> {app.customer_name}</p>
                <p><strong>Tarih:</strong> {new Date(app.appointment_time).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                <p><strong>Durum:</strong> <span className="status-badge" style={{ backgroundColor: getStatusColor(app.status) }}>{app.status}</span></p>
              </div>
              <div className="action-buttons">
                {app.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusUpdate(app.id, 'confirmed')} className="btn-confirm">Onayla</button>
                    <button onClick={() => handleStatusUpdate(app.id, 'cancelled')} className="btn-cancel">İptal Et</button>
                  </>
                )}
                {app.status === 'confirmed' && (
                  <button onClick={() => setCompletingAppointment(app)} className="btn-complete">Tamamla</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BarberDashboardPage;