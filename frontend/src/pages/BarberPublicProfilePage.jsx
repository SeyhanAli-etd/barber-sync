import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBarberById } from '../services/barberService';
import RatingSummary from '../components/RatingSummary';
import ReviewCard from '../components/ReviewCard';
import MapDisplay from '../components/MapDisplay';
import PhotoGallery from '../components/PhotoGallery';
import WorkingHoursDisplay from '../components/WorkingHoursDisplay';
import './BarberPublicProfilePage.css';

const BarberPublicProfilePage = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          </div>
        </div>
        <div className="profile-content">
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