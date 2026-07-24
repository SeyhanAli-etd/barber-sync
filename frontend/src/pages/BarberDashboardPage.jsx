import React, { useState, useEffect, useMemo } from 'react';
import { getMyBarberAppointments, updateAppointmentStatus, completeAppointment } from '../services/appointmentService';
import { getMyServices } from '../services/serviceService';
import Modal from '../components/Modal';
import './ListPage.css';
import './BarberDashboardPage.css';

// Tarihi YYYY-MM-DD formatına çeviren yardımcı fonksiyon
const toYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Haftanın başlangıcını (Pazartesi) bulan yardımcı fonksiyon
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // Pazar - 0, Pazartesi - 1, ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // gün pazar ise ayarla
  return new Date(d.setDate(diff));
};

// Durum değerlerinin Türkçe karşılıkları (görüntüleme amaçlı)
const statusLabels = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
};

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

// Randevuyu tamamlamak için kullanılan modal
const CompleteAppointmentModal = ({ appointment, services, onComplete, onCancel }) => {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  useEffect(() => {
    if (services.length > 0) {
      setSelectedServiceId(services[0].id);
      setFinalPrice(services[0].price);
    }
  }, [services]);

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedServiceId(serviceId);
      setFinalPrice(service.price);
    }
  };

  const handleSubmit = () => {
    if (!selectedServiceId) {
      alert('Lütfen bir hizmet seçin.');
      return;
    }
    onComplete(appointment.id, {
      service_id: selectedServiceId,
      final_price: finalPrice,
    });
  };

  return (
    <div className="complete-modal">
      <h3>Randevuyu Tamamla</h3>
      <p><strong>Müşteri:</strong> {appointment.customer_name}</p>
      <div className="form-group">
        <label>Yapılan Hizmet:</label>
        <select value={selectedServiceId} onChange={handleServiceChange}>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.price} TL
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Nihai Fiyat (TL):</label>
        <input
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value)}
          placeholder="Örn: 150.00"
        />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>İptal</button>
        <button onClick={handleSubmit}>Randevuyu Tamamla</button>
      </div>
    </div>
  );
};

const BarberDashboardPage = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'today', 'this-week'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [appointmentData, serviceData] = await Promise.all([
        getMyBarberAppointments(),
        getMyServices(),
      ]);
      setAllAppointments(appointmentData);
      setServices(serviceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const processedAppointments = useMemo(() => {
    const now = new Date();
    const todayStr = toYYYYMMDD(now);

    const startOfWeek = getStartOfWeek(now);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = allAppointments.filter(app => {
        // Durum filtresi
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        if (!statusMatch) return false;

        // Tarih filtresi
        const appDate = new Date(app.appointment_time);
        const appDateStr = toYYYYMMDD(appDate);

        const dateMatch =
            viewMode === 'all' ||
            (viewMode === 'today' && appDateStr === todayStr) ||
            (viewMode === 'this-week' && appDate >= startOfWeek && appDate <= endOfWeek);

        if (!dateMatch) return false;

        // Arama sorgusu filtresi
        const searchMatch = !searchQuery || app.customer_name.toLowerCase().includes(lowercasedQuery);

        return searchMatch;
    });

    // Tarihe göre grupla
    const grouped = filtered.reduce((acc, app) => {
        const dateKey = toYYYYMMDD(new Date(app.appointment_time));
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(app);
        return acc;
    }, {});

    // Tarihleri (anahtarları) sırala ve [tarih, randevular] dizisi olarak döndür
    return Object.entries(grouped).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB));

  }, [allAppointments, searchQuery, viewMode, statusFilter]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      fetchAllData(); // Listeyi yenile
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const handleComplete = async (appointmentId, data) => {
    try {
      await completeAppointment(appointmentId, data);
      setAppointmentToComplete(null); // Modalı kapat
      fetchAllData(); // Listeyi yenile
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const renderStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{statusLabels[status] || status}</span>;
  };

  const renderAppointmentCard = (app) => (
    <li key={app.id} className="list-item-card">
      <div>
        <p><strong>Müşteri:</strong> {app.customer_name}</p>
        <p><strong>Telefon:</strong> {app.customer_phone || 'Belirtilmemiş'}</p>
        <p><strong>Tarih:</strong> {new Date(app.appointment_time).toLocaleString('tr-TR')}</p>
        <p><strong>Durum:</strong> {renderStatusBadge(app.status)}</p>
        {app.notes && <p><strong>Not:</strong> {app.notes}</p>}
      </div>
      <div className="action-buttons">
        {app.status === 'pending' && (
          <>
            <button onClick={() => handleStatusUpdate(app.id, 'confirmed')} className="btn-confirm">Onayla</button>
            <button onClick={() => handleStatusUpdate(app.id, 'cancelled')} className="btn-cancel">İptal Et</button>
          </>
        )}
        {app.status === 'confirmed' && (
          <button onClick={() => setAppointmentToComplete(app)} className="btn-complete">Tamamla</button>
        )}
        {app.status === 'completed' && (
          <button disabled>Tamamlandı</button>
        )}
      </div>
    </li>
  );

  if (loading) return <div>Randevu paneli yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="list-page">
      <style>{statusBadgeStyles}</style>
      <h2>Randevu Paneli</h2>

      <div className="dashboard-controls">
        <input type="text" placeholder="Müşteri adıyla ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        <div className="filter-group">
          <span className="filter-label">Tarih:</span>
          <div className="filter-buttons">
            <button onClick={() => setViewMode('today')} className={`filter-btn ${viewMode === 'today' ? 'active' : ''}`}>Bugün</button>
            <button onClick={() => setViewMode('this-week')} className={`filter-btn ${viewMode === 'this-week' ? 'active' : ''}`}>Bu Hafta</button>
            <button onClick={() => setViewMode('all')} className={`filter-btn ${viewMode === 'all' ? 'active' : ''}`}>Tümü</button>
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Durum:</span>
          <div className="filter-buttons">
            <button onClick={() => setStatusFilter('all')} className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}>Tümü</button>
            <button onClick={() => setStatusFilter('pending')} className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}>Bekleyen</button>
            <button onClick={() => setStatusFilter('confirmed')} className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}>Onaylanmış</button>
            <button onClick={() => setStatusFilter('completed')} className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}>Tamamlanmış</button>
            <button onClick={() => setStatusFilter('cancelled')} className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}>İptal</button>
          </div>
        </div>
      </div>

      {processedAppointments.length === 0 ? (<p>Filtrelerinize uygun randevu bulunmamaktadır.</p>) : (processedAppointments.map(([date, appointments]) => (<div key={date} className="day-group"><h3>{new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3><ul className="list-container">{appointments.map(renderAppointmentCard)}</ul></div>)))}

      {appointmentToComplete && <Modal onClose={() => setAppointmentToComplete(null)}><CompleteAppointmentModal appointment={appointmentToComplete} services={services} onComplete={handleComplete} onCancel={() => setAppointmentToComplete(null)} /></Modal>}
    </div>
  );
};

export default BarberDashboardPage;