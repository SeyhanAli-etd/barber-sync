import React, { useState, useEffect } from 'react';
import { getBarbers } from '../services/barberService';
import { Link } from 'react-router-dom';

const BarbersListPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();
        setBarbers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []); // Boş dizi, bu effect'in sadece component ilk render olduğunda çalışmasını sağlar.

  if (loading) return <div>Berberler yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div>
      <h2>Berberler</h2>
      {barbers.length === 0 ? (
        <p>Gösterilecek berber bulunamadı.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {barbers.map((barber) => (
            <li key={barber.user_id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{barber.shop_name || barber.full_name}</h3>
              <p>{barber.address || 'Adres belirtilmemiş'}</p>
              <Link to={`/barbers/${barber.user_id}`}>Profilini Görüntüle</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BarbersListPage;