import React, { useState, useEffect } from 'react';
import { getMyCustomerAppointments } from '../services/appointmentService';
import { createReview } from '../services/reviewService';
import Modal from '../components/Modal';
import ReviewForm from '../components/ReviewForm';
import './ListPage.css';

const statusBadgeStyles = `
  .status-badge {
    padding: 0.3em 0.7em;
    font-size: 0.85rem;
    font-weight: 700;
    border-radius: 1rem;
    text-transform: capitalize;
    color: #fff;
  }
  .status-badge.status-pending {
    background-color: #ffc107;
    color: #212529; /* Sarı arka plan için koyu metin */
  }
  .status-badge.status-confirmed {
    background-color: #17a2b8;
  }
  .status-badge.status-completed {
    background-color: #28a745;
  }
  .status-badge.status-cancelled {
    background-color: #dc3545;
  }
`;

const CustomerAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyCustomerAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedAppointment(null);
    setShowReviewModal(false);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await createReview(reviewData);
      alert('Yorumunuz için teşekkür ederiz!');
      handleCloseReviewModal();
      fetchAppointments(); // Listeyi yenileyerek "Yorum Yapıldı" durumunu göster
    } catch (err) {
      // Form, kendi içindeki hatayı zaten gösterecektir.
      // Hatanın tekrar fırlatılması, formun loading durumunu doğru yönetmesini sağlar.
      throw err;
    }
  };

  const renderStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  };

  if (loading) return <div>Randevularınız yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="list-page">
      <style>{statusBadgeStyles}</style>
      <h2>Randevularım</h2>
      {appointments.length === 0 ? (
        <p>Henüz bir randevunuz bulunmamaktadır.</p>
      ) : (
        <ul className="list-container">
          {appointments.map((app) => (
            <li key={app.id} className="list-item-card">
              <div>
                <p><strong>Berber:</strong> {app.barber_name}</p>
                <p><strong>Dükkan:</strong> {app.shop_name || 'N/A'}</p>
                <p><strong>Tarih:</strong> {new Date(app.appointment_time).toLocaleString('tr-TR')}</p>
                <p><strong>Durum:</strong> {renderStatusBadge(app.status)}</p>
              </div>
              <div className="action-buttons">
                {app.status === 'completed' &&
                  (app.has_review ? (
                    <button disabled>Yorum Yapıldı</button>
                  ) : (
                    <button onClick={() => handleOpenReviewModal(app)}>Yorum Yap</button>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showReviewModal && (
        <Modal onClose={handleCloseReviewModal}>
          <ReviewForm appointment={selectedAppointment} onSubmit={handleReviewSubmit} onCancel={handleCloseReviewModal} />
        </Modal>
      )}
    </div>
  );
};

export default CustomerAppointmentsPage;