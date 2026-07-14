import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyServices } from '../services/serviceService';
import { completeAppointment } from '../services/appointmentService';
import './Modal.css';

const CompleteAppointmentModal = ({ appointment, onClose, onComplete }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getMyServices(token);
        setServices(data);
        if (data.length > 0) {
          setSelectedService(data[0].id); // İlk hizmeti önden seç
        }
      } catch (err) {
        setError('Hizmetler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      setError('Lütfen bir hizmet seçin.');
      return;
    }
    try {
      const data = {
        service_id: selectedService,
      };
      if (finalPrice) {
        data.final_price = parseFloat(finalPrice);
      }
      const updatedAppointment = await completeAppointment(appointment.id, data, token);
      onComplete(updatedAppointment); // Başarılı olunca ana bileşeni bilgilendir
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="modal-overlay"><div className="modal-content">Hizmetler yükleniyor...</div></div>;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Randevuyu Tamamla</h3>
        <p><strong>Müşteri:</strong> {appointment.customer_name}</p>
        <p><strong>Tarih:</strong> {new Date(appointment.appointment_time).toLocaleString('tr-TR')}</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="service">Yapılan Hizmet:</label>
            <select id="service" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
              {services.length === 0 ? (
                <option disabled>Hizmet bulunamadı. Lütfen önce hizmet ekleyin.</option>
              ) : (
                services.map(s => <option key={s.id} value={s.id}>{s.name} - {s.price} TL</option>)
              )}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="finalPrice">Nihai Fiyat (Opsiyonel):</label>
            <input type="number" id="finalPrice" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} placeholder="İndirimli fiyat girin" min="0" step="0.01" />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
            <button type="submit" disabled={services.length === 0}>Randevuyu Tamamla</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteAppointmentModal;