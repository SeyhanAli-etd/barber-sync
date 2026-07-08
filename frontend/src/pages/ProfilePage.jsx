import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyBarberProfile, upsertMyBarberProfile } from '../services/profileService';

// Barber's profile management component
const BarberProfileManager = () => {
  const { token } = useAuth();
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyBarberProfile(token);
        if (data) {
          setProfile(prevProfile => ({
            ...prevProfile,
            shop_name: data.shop_name || prevProfile.shop_name,
            address: data.address || prevProfile.address,
            working_hours: data.working_hours || prevProfile.working_hours,
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await upsertMyBarberProfile(profile, token);
      setSuccess('Profil başarıyla güncellendi!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Profil yükleniyor...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Berber Profilini Yönet</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <label>Dükkan Adı:</label>
        <input type="text" name="shop_name" value={profile.shop_name} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Adres:</label>
        <textarea name="address" value={profile.address} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h4>Çalışma Saatleri</h4>
        <p style={{fontSize: '0.8rem', color: '#666'}}>Saat aralığı için "09:00-19:00" formatını, kapalı günler için "closed" yazın.</p>
        {Object.keys(profile.working_hours).map(day => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ width: '100px', textTransform: 'capitalize' }}>{day}:</label>
            <input type="text" name={`wh-${day}`} value={profile.working_hours[day]} onChange={handleChange} style={{ flex: 1, padding: '8px' }} />
          </div>
        ))}
      </div>
      <button type="submit">Profili Kaydet</button>
    </form>
  );
};

// Customer's profile display component
const CustomerProfile = () => {
    const { user } = useAuth();
    return (
        <div>
            <h2>Profilim</h2>
            <p><strong>Ad Soyad:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <div>Kullanıcı bilgileri yükleniyor...</div>;

  return user.role === 'barber' ? <BarberProfileManager /> : <CustomerProfile />;
};

export default ProfilePage;