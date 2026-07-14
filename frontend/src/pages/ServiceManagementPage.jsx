import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyServices, createService, updateService, deleteService } from '../services/serviceService';
import './ServiceManagementPage.css';
import './ListPage.css'; // Reusing list styles

const ServiceForm = ({ serviceToEdit, onFormSubmit, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_minutes: '',
  });

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        price: serviceToEdit.price,
        duration_minutes: serviceToEdit.duration_minutes,
      });
    } else {
      setFormData({ name: '', price: '', duration_minutes: '' });
    }
  }, [serviceToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card service-form">
      <h3>{serviceToEdit ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</h3>
      <div className="form-group">
        <label>Hizmet Adı:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Fiyat (TL):</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
      </div>
      <div className="form-group">
        <label>Süre (dakika):</label>
        <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required min="5" step="5" />
      </div>
      <button type="submit">{serviceToEdit ? 'Güncelle' : 'Ekle'}</button>
      {serviceToEdit && <button type="button" onClick={clearEdit} className="btn-secondary">İptal</button>}
    </form>
  );
};

const ServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const { token } = useAuth();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getMyServices(token);
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const handleFormSubmit = async (formData) => {
    try {
      if (serviceToEdit) {
        await updateService(serviceToEdit.id, formData, token);
      } else {
        await createService(formData, token);
      }
      setServiceToEdit(null); // Clear form
      fetchServices(); // Refetch list
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      try {
        await deleteService(serviceId, token);
        fetchServices(); // Refetch list
      } catch (err) {
        alert(`Hata: ${err.message}`);
      }
    }
  };

  if (loading) return <div>Hizmetler yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div className="list-page service-management-page">
      <h2>Hizmet Yönetimi</h2>
      <ServiceForm serviceToEdit={serviceToEdit} onFormSubmit={handleFormSubmit} clearEdit={() => setServiceToEdit(null)} />
      <h3>Mevcut Hizmetler</h3>
      {services.length === 0 ? (
        <p>Henüz eklenmiş bir hizmetiniz bulunmamaktadır.</p>
      ) : (
        <ul className="list-container">
          {services.map((service) => (
            <li key={service.id} className="list-item-card">
              <div>
                <strong>{service.name}</strong> ({service.duration_minutes} dk) - {service.price} TL
              </div>
              <div className="action-buttons">
                <button onClick={() => setServiceToEdit(service)}>Düzenle</button>
                <button onClick={() => handleDelete(service.id)} className="btn-cancel">Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceManagementPage;