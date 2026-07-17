import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBarberById } from '../services/barberService';
import RatingSummary from '../components/RatingSummary';
import ReviewCard from '../components/ReviewCard';
import MapDisplay from '../components/MapDisplay';
import PhotoGallery from '../components/PhotoGallery';
import WorkingHoursDisplay from '../components/WorkingHoursDisplay';
import './BarberPublicProfilePage.css';

// Helper function to calculate distance between two coordinates
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  
  const pLat1 = parseFloat(lat1);
  const pLon1 = parseFloat(lon1);
  const pLat2 = parseFloat(lat2);
  const pLon2 = parseFloat(lon2);

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

const BarberPublicProfilePage = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchBarberProfile = async () => {
      try {
        setLoading(true);
        const data = await getBarberById(id);
        setBarber(data);
      } catch (err) {
        setError('Berber profili getirilirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchBarberProfile();
  }, [id]);

  // Effect to calculate distance from user to barber
  useEffect(() => {
    if (!barber?.latitude || !barber?.longitude) {
      return; // Can't calculate without barber's location
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const dist = getDistanceInKm(userLat, userLon, barber.latitude, barber.longitude);
          setDistance(dist);
        },
        () => {
          // User denied location access, fail silently.
          // We won't show the distance.
        }
      );
    }
    // If geolocation is not supported, we just don't show the distance.
  }, [barber]);

  if (loading) {
    return <div className="profile-page-container"><h2>Yükleniyor...</h2></div>;
  }

  if (error) {
    return <div className="profile-page-container"><h2 className="error-message">{error}</h2></div>;
  }

  if (!barber) {
    return <div className="profile-page-container"><h2>Berber bulunamadı.</h2></div>;
  }

  const avatarSrc = barber.avatar_url
    ? `http://localhost:5000/${barber.avatar_url}`
    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiM0NDQiLz48L3N2Zz4=";

  return (
    <div className="profile-page-container">
      <header className="profile-header">
        <img src={avatarSrc} alt={barber.full_name} className="profile-avatar" />
        <div className="profile-header-info">
          <h1>{barber.shop_name || barber.full_name}</h1>
          {barber.shop_name && <h2>{barber.full_name}</h2>}
          <p>{barber.address}</p>
        </div>
        <div className="profile-header-actions">
          <Link to={`/booking`} state={{ preselectedBarberId: barber.id }} className="btn-glow">
            Randevu Al
          </Link>
        </div>
      </header>

      <main className="profile-main-content">
        <div className="profile-sidebar">
          <WorkingHoursDisplay workingHours={barber.working_hours} />
          <div className="map-section">
            <h4>Konum</h4>
            <MapDisplay lat={barber.latitude} lon={barber.longitude} shopName={barber.shop_name} />
            {barber.latitude && barber.longitude && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${barber.latitude},${barber.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link"
              >
                Yol Tarifi Al
              </a>
            )}
            {distance !== null && isFinite(distance) && (
              <p className="distance-info-profile">
                Yaklaşık Mesafe: <strong>{distance.toFixed(1)} km</strong>
              </p>
            )}
          </div>
        </div>
        <div className="profile-content">
          <div className="gallery-section">
            <h3>Hizmetler</h3>
            {barber.services && barber.services.length > 0 ? (
              <ul className="service-list">
                {barber.services.map(service => (
                  <li key={service.id} className="service-item">
                    <span className="service-name">{service.name}</span>
                    <span className="service-price">{service.price} TL</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Bu berberin tanımlı bir hizmeti bulunmamaktadır.</p>
            )}
          </div>

          <div className="gallery-section">
            <h3>Galeri</h3>
            <PhotoGallery photos={barber.gallery} />
          </div>
          <div className="reviews-section">
            <h3>Müşteri Yorumları</h3>
            <RatingSummary reviews={barber.reviews} />
            <div className="review-list">
              {barber.reviews && barber.reviews.length > 0 ? (
                barber.reviews.map(review => <ReviewCard key={review.id} review={review} />)
              ) : (
                <p>Henüz yorum yapılmamış.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BarberPublicProfilePage;