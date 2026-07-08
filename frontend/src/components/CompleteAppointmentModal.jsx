import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyServices } from '../services/serviceService';
import { completeAppointment } from '../services/appointmentService';

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

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  };

  const modalContentStyle = {
    background: 'white', padding: '2rem', borderRadius: '8px',
    width: '90%', maxWidth: '500px',
  };

  if (loading) {
    return <div style={modalStyle}><div style={modalContentStyle}>Hizmetler yükleniyor...</div></div>;
  }

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Randevuyu Tamamla</h3>
        <p><strong>Müşteri:</strong> {appointment.customer_name}</p>
        <p><strong>Tarih:</strong> {new Date(appointment.appointment_time).toLocaleString('tr-TR')}</p>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="service">Yapılan Hizmet:</label>
            <select id="service" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
              {services.length === 0 ? (
                <option disabled>Hizmet bulunamadı. Lütfen önce hizmet ekleyin.</option>
              ) : (
                services.map(s => <option key={s.id} value={s.id}>{s.name} - {s.price} TL</option>)
              )}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="finalPrice">Nihai Fiyat (Opsiyonel):</label>
            <input type="number" id="finalPrice" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)}
              placeholder="İndirimli fiyat girin" min="0" step="0.01" style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose}>İptal</button>
            <button type="submit" disabled={services.length === 0} style={{ backgroundColor: '#17a2b8', color: 'white' }}>Randevuyu Tamamla ve Ciroya Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteAppointmentModal;