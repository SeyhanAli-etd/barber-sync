import React, { useState, useEffect, useMemo } from 'react';
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

// Helper function to calculate distance between two coordinates
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  
  // Gelen koordinatların string olabileceği ihtimaline karşı sayıya çeviriyoruz.
  const pLat1 = parseFloat(lat1);
  const pLon1 = parseFloat(lon1);
  const pLat2 = parseFloat(lat2);
  const pLon2 = parseFloat(lon2);

  // Sayıya çevirme başarısız olursa (NaN), mesafeyi sonsuz kabul et.
  // Bu, sort fonksiyonunun çökmesini engeller.
  if (isNaN(pLat1) || isNaN(pLon1) || isNaN(pLat2) || isNaN(pLon2)) {
    return Infinity;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = (pLat2 - pLat1) * (Math.PI / 180);
  const dLon = (pLon2 - pLon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pLat1 * (Math.PI / 180)) * Math.cos(pLat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const BarbersListPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'rating', 'location'
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

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

  const handleSortByLocation = () => {
    setLocationError('');
    if (sortBy === 'location') {
      setSortBy('default'); // Toggle off
      return;
    }
    if (userLocation) {
      setSortBy('location');
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSortBy('location');
      },
      () => {
        setLocationError('Konum bilgisi alınamadı. Lütfen tarayıcı izinlerinizi kontrol edin.');
      }
    );
  };

  const sortedAndFilteredBarbers = useMemo(() => {
    let result = barbers.filter(barber => {
      // Güvenlik kontrolü: Beklenmedik bir veri formatı gelirse çökmeyi engelle.
      if (!barber || !barber.full_name) return false;
      const searchTerm = searchQuery.toLowerCase();
      const barberName = barber.full_name.toLowerCase();
      const shopName = (barber.shop_name || '').toLowerCase();
      return barberName.includes(searchTerm) || shopName.includes(searchTerm);
    });

    if (sortBy === 'rating') {
      // Puanlamanın sayısal olduğundan emin olarak sırala
      result.sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
    } else if (sortBy === 'location' && userLocation) {
      // Calculate distance for each barber and attach it
      result = result.map(barber => ({
        ...barber,
        distance: getDistanceInKm(userLocation.lat, userLocation.lng, barber.latitude, barber.longitude)
      })).sort((a, b) => {
        // NaN'a neden olabilecek basit çıkarma işlemi yerine
        // daha sağlam bir karşılaştırma yap. Bu, Infinity - Infinity durumunu yönetir.
        if (a.distance < b.distance) return -1;
        if (a.distance > b.distance) return 1;
        return 0;
      });
    }
    // 'default' sort is the natural order from the API

    return result;
  }, [barbers, searchQuery, sortBy, userLocation]);

  if (loading) return <div>Berberler yükleniyor...</div>;
  if (error) return <div className="error-message">Hata: {error}</div>;

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

      <div className="sort-options-container">
        <span>Sırala:</span>
        <button className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy(sortBy === 'rating' ? 'default' : 'rating')}>Yüksek Puan</button>
        <button className={`sort-btn ${sortBy === 'location' ? 'active' : ''}`} onClick={handleSortByLocation}>Yakın Konum</button>
      </div>
      {locationError && <p className="error-message small">{locationError}</p>}

      {sortedAndFilteredBarbers.length === 0 ? (
        <p>{searchQuery ? `"${searchQuery}" ile eşleşen berber bulunamadı.` : 'Gösterilecek berber bulunamadı.'}</p>
      ) : (
        <div className="barbers-grid">
          {sortedAndFilteredBarbers.map((barber) => (
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
                  {/* Sadece geçerli ve sonlu bir mesafe varsa göster */}
                  {sortBy === 'location' && isFinite(barber.distance) && (
                    <span className="distance-info">~{barber.distance.toFixed(1)} km</span>
                  )}
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