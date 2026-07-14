import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyBarberProfile, upsertMyBarberProfile, getMyCustomerProfile, updateMyCustomerProfile } from '../services/profileService';
import { getMyServices, createService, updateService, deleteService } from '../services/serviceService';
import './ProfilePage.css';
import './GalleryManagementTab.css'; // Galeri yönetimi için CSS
import './ListPage.css'; // Reusing list styles
import './ServiceManagementPage.css'; // Reusing form styles
import ImageUpload from '../components/ImageUpload';
import MapAddressPicker from '../components/MapAddressPicker';
import GalleryManagementTab from './GalleryManagementTab';

// --- Service Form Component (from ServiceManagementPage) ---
const ServiceForm = ({ serviceToEdit, onFormSubmit, clearEdit }) => {
  const [formData, setFormData] = useState({ name: '', price: '', duration_minutes: '' });

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

// --- Service Management Tab Content ---
const ServiceListManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const fetchServices = async () => {
    try { setLoading(true); const data = await getMyServices(); setServices(data); } 
    catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (serviceToEdit) { await updateService(serviceToEdit.id, formData); } 
      else { await createService(formData); }
      setServiceToEdit(null); fetchServices();
    } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      try { await deleteService(serviceId); fetchServices(); } 
      catch (err) { alert(`Hata: ${err.message}`); }
    }
  };

  if (loading) return <div>Hizmetler yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <ServiceForm serviceToEdit={serviceToEdit} onFormSubmit={handleFormSubmit} clearEdit={() => setServiceToEdit(null)} />
      <h3>Mevcut Hizmetler</h3>
      {services.length > 0 ? (
        <ul className="list-container">{services.map(service => (<li key={service.id} className="list-item-card"><div><strong>{service.name}</strong> ({service.duration_minutes} dk) - {service.price} TL</div><div className="action-buttons"><button onClick={() => setServiceToEdit(service)}>Düzenle</button><button onClick={() => handleDelete(service.id)} className="btn-cancel">Sil</button></div></li>))}</ul>
      ) : (<p>Henüz eklenmiş bir hizmetiniz bulunmamaktadır.</p>)}
    </div>
  );
};

// Barber's profile management component
const ProfileInfoForm = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    shop_name: '',
    address: '',
    working_hours: {
      monday: '09:00-19:00',
      tuesday: '09:00-19:00',
      wednesday: '09:00-19:00',
      thursday: '09:00-19:00',
      friday: '09:00-19:00',
      saturday: '10:00-17:00',
      sunday: 'closed',
    },
    latitude: null,
    longitude: null,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadKey, setUploadKey] = useState(0); // Bileşeni sıfırlamak için key

  useEffect(() => {
    const fetchProfile = async () => {
      // Güvenlik önlemi: Sadece berber rolündeki kullanıcılar için veri çek.
      if (user?.role !== 'barber') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Veri çekme işlemi başlamadan önce yükleniyor durumunu ayarla.
        const data = await getMyBarberProfile();
        if (data) {
          setProfile(prevProfile => ({
            // Bu state artık SADECE berber profiline özel bilgileri tutacak.
            // Avatar bilgisi global `user` state'inden gelecek.
            shop_name: data.shop_name || '',
            address: data.address || '',
            working_hours: data.working_hours || prevProfile.working_hours, // Keep default structure
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if it's a working_hours input
    if (name.startsWith('wh-')) {
      const day = name.split('-')[1];
      setProfile(prev => ({
        ...prev,
        working_hours: { ...prev.working_hours, [day]: value }
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleLocationSelect = (lat, lon) => {
    setProfile(prev => ({
      ...prev,
      latitude: lat,
      longitude: lon,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('shop_name', profile.shop_name);
      formData.append('address', profile.address);
      formData.append('working_hours', JSON.stringify(profile.working_hours));
      formData.append('latitude', profile.latitude || '');
      formData.append('longitude', profile.longitude || '');
      // SADECE yeni bir dosya varsa avatarı ekle.
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Önce profili güncelle.
      await upsertMyBarberProfile(formData);
      // Ardından, AuthContext'teki kullanıcı bilgisini sunucudan yeniden çekerek tazele.
      await refreshUser();

      setAvatarFile(null);
      setSuccess('Profil başarıyla güncellendi!');
      setUploadKey(prevKey => prevKey + 1); // ImageUpload bileşenini yeniden oluşturmaya zorla
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Profil yükleniyor...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ImageUpload key={uploadKey} currentAvatar={user.avatar_url} onFileSelect={setAvatarFile} />
      <div style={{ marginBottom: '1rem' }}>
        <label>Dükkan Adı:</label>
        <input type="text" name="shop_name" value={profile.shop_name} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Adres:</label>
        <textarea name="address" value={profile.address} onChange={handleChange} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h4>Çalışma Saatleri</h4>
        <p className="form-hint">Saat aralığı için "09:00-19:00" formatını, kapalı günler için "closed" yazın.</p>
        {Object.keys(profile.working_hours).map(day => (
          <div key={day} className="working-hour-row">
            <label className="day-label">{day}:</label>
            <input type="text" name={`wh-${day}`} value={profile.working_hours[day]} onChange={handleChange} />
          </div>
        ))}
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Konum Seçimi</h4>
        <p className="form-hint">Adresinizi harita üzerinden seçin. Enlem ve boylam otomatik olarak dolacaktır.</p>
        <MapAddressPicker initialLat={profile.latitude} initialLon={profile.longitude} onLocationSelect={handleLocationSelect} />
        <input type="hidden" name="latitude" value={profile.latitude || ''} />
        <input type="hidden" name="longitude" value={profile.longitude || ''} />
      </div>
      <button type="submit">Profili Kaydet</button>
    </form>
  );
};

// Customer's profile management component
const CustomerProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone_number: user.phone_number || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadKey, setUploadKey] = useState(0); // Bileşeni sıfırlamak için key

  useEffect(() => {
    setProfileData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
    });
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profileData.full_name);
      formData.append('email', profileData.email);
      formData.append('phone_number', profileData.phone_number);
      // SADECE yeni bir dosya varsa avatarı ekle.
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Önce profili güncelle.
      await updateMyCustomerProfile(formData);
      // Ardından, AuthContext'teki kullanıcı bilgisini sunucudan yeniden çekerek tazele.
      await refreshUser();

      setAvatarFile(null); // Başarılı yükleme sonrası önizlemeyi temizle
      setUploadKey(prevKey => prevKey + 1); // ImageUpload bileşenini yeniden oluşturmaya zorla
      setSuccess('Profil başarıyla güncellendi!');
    } catch (err) {
      setError(err.message || 'Profil güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ImageUpload key={uploadKey} currentAvatar={user.avatar_url} onFileSelect={setAvatarFile} />
      <div style={{ marginBottom: '1rem' }}>
        <label>Ad Soyad:</label>
        <input type="text" name="full_name" value={profileData.full_name} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Email:</label>
        <input type="email" name="email" value={profileData.email} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Telefon Numarası:</label>
        <input type="tel" name="phone_number" value={profileData.phone_number} onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Kaydediliyor...' : 'Profili Kaydet'}
      </button>
    </form>
  );
};

// Main container for barber's profile page with tabs
const BarberProfileManager = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="profile-manager">
      <h2>Profil ve Hizmet Yönetimi</h2>
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil Bilgileri
        </button>
        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Hizmetlerim
        </button>
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Galeri Yönetimi
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'profile' && <ProfileInfoForm />}
        {activeTab === 'services' && <ServiceListManager />}
        {activeTab === 'gallery' && <GalleryManagementTab />}
      </div>
    </div>
  );
};

// Customer's profile display component
const CustomerProfile = () => (
  <div className="profile-manager">
    <h2>Profilim</h2>
    <CustomerProfileForm />
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <div>Kullanıcı bilgileri yükleniyor...</div>;

  return (
    <div className="profile-page-wrapper">
      {user.role === 'barber' ? <BarberProfileManager /> : <CustomerProfile />}
    </div>
  );
};

export default ProfilePage;