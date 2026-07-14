import React, { useState, useEffect } from 'react';
import { getAllBarbers } from '../services/barberService';
import { Link } from 'react-router-dom';
import './BarbersListPage.css';

// A small component for star ratings
const StarDisplay = ({ rating }) => {
  // Bu fonksiyon, olası hatalı veya eksik 'rating' verisine karşı
  // bileşeni daha sağlam hale getirir.
  const numericRating = Number(rating);
  if (isNaN(numericRating)) {
    // Eğer 'rating' bir sayı değilse, çökmemesi için 5 boş yıldız göster.
    return (
      <div className="star-display">
        {[...Array(5)].map((_, i) => <span key={`empty-${i}`} className="empty">★</span>)}
      </div>
    );
  }

  const fullStars = Math.max(0, Math.min(5, Math.floor(numericRating)));

  return (
    <div className="star-display">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
      {[...Array(5 - fullStars)].map((_, i) => <span key={`empty-${i}`} className="empty">★</span>)}
    </div>
  );
};

const BarbersListPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getAllBarbers();
        setBarbers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (loading) return <div>Berberler yükleniyor...</div>;
  if (error) return <div className="error-message">Hata: {error}</div>;

  const filteredBarbers = barbers.filter(barber => {
    if (!barber || !barber.full_name) return false;
    const searchTerm = searchQuery.toLowerCase();
    const barberName = barber.full_name.toLowerCase();
    const shopName = (barber.shop_name || '').toLowerCase();
    return barberName.includes(searchTerm) || shopName.includes(searchTerm);
  });

  return (
    <div className="barbers-list-page">
      <h2>Berberleri Keşfet</h2>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Berber veya dükkan adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredBarbers.length === 0 ? (
        <p>{searchQuery ? `"${searchQuery}" ile eşleşen berber bulunamadı.` : 'Gösterilecek berber bulunamadı.'}</p>
      ) : (
        <div className="barbers-grid">
          {filteredBarbers.map((barber) => (
            <Link to={`/barber/${barber.id}`} key={barber.id} className="barber-card-link">
              <div className="barber-card">
                <img
                  src={barber.avatar_url ? `http://localhost:5000/${barber.avatar_url}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM0NDQiLz48L3N2Zz4="}
                  alt={barber.full_name}
                  className="barber-card-avatar"
                />
                <div className="barber-card-info">
                  <h3>{barber.shop_name || barber.full_name}</h3>
                  {barber.shop_name && <p className="barber-name-sub">{barber.full_name}</p>}
                </div>
                <div className="barber-card-rating">
                  <StarDisplay rating={barber.average_rating} />
                  <span>({barber.review_count} yorum)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarbersListPage;