import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllBarbers, getBarberById } from '../services/barberService';
import { getBarberReviews } from '../services/reviewService';
import AppointmentCalendar from '../components/AppointmentCalendar';
import RatingSummary from '../components/RatingSummary';
import ReviewCard from '../components/ReviewCard';
import MapDisplay from '../components/MapDisplay';
import PhotoGallery from '../components/PhotoGallery';
import './BookingPage.css';

const BookingPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const data = await getAllBarbers();
        setBarbers(data);
        // Check if a barber was pre-selected from another page (e.g., public profile)
        const preselectedId = location.state?.preselectedBarberId;
        if (preselectedId) {
          const preselectedBarber = data.find(b => b.id === preselectedId);
          if (preselectedBarber) handleBarberSelect(preselectedBarber);
        }
      } catch (err) {
        setError('Berberler getirilirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, [location.state]);

  const handleBarberSelect = async (barber) => {
    setSelectedService(null);
    setActiveTab('services'); // Reset to services tab on new barber selection
    setReviews([]); // Reset reviews on new barber selection

    if (selectedBarber?.id === barber.id && !selectedBarber.isLoading) {
      return;
    }

    try {
      // Set loading states
      setSelectedBarber({ ...barber, isLoading: true });

      // Fetch profile and reviews in parallel for better performance
      const [fullProfile, barberReviews] = await Promise.all([
        getBarberById(barber.id),
        getBarberReviews(barber.id)
      ]);
      
      setSelectedBarber(fullProfile);
      setReviews(barberReviews);
    } catch (err) {
      setError(`'${barber.full_name}' için detaylar getirilemedi.`);
      setSelectedBarber(null);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleAppointmentBooked = () => {
    alert('Randevunuz başarıyla oluşturuldu!');
    setSelectedBarber(null);
    setSelectedService(null);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error && barbers.length === 0) return <div className="error-message">{error}</div>;

  return (
    <div className="booking-page">
      <h2 className="booking-title">Randevu Planla</h2>
      <div className="booking-container">
        <div className="selection-panel">
          {/* 1. Berber Seçimi */}
          <div className="panel-section">
            <h3>1. Berber Seçin</h3>
            <div className="barber-selection-list">
              {barbers.map((barber) => (
                <div // This outer div is for layout and selection styling
                  key={barber.id}
                  className={`barber-card-small ${selectedBarber?.id === barber.id ? 'selected' : ''}`}
                  onClick={() => handleBarberSelect(barber)}
                >
                  <img src={barber.avatar_url ? `http://localhost:5000/${barber.avatar_url}` : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg=="} alt={barber.full_name} className="barber-avatar-small" />
                  <div className="barber-info-small">
                    <h4>{barber.full_name}</h4>
                    <span>{barber.shop_name || 'Bağımsız'}</span>
                  </div>
                  <Link to={`/barber/${barber.id}`} className="profile-link-icon" title="Profili Görüntüle">➔</Link>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="error-message" style={{marginTop: '1rem'}}>{error}</p>}
        </div>

        {/* 3. Tarih ve Saat Seçimi */}
        <div className="scheduler-panel">
          {!selectedBarber ? (
            <div className="placeholder-text">
              Lütfen bir berber seçerek başlayın.
            </div>
          ) : selectedBarber.isLoading ? (
            <div className="placeholder-text">
              Berber bilgileri yükleniyor...
            </div>
          ) : (
            <>
              <div className="selected-info">
                <p><strong>Berber:</strong> {selectedBarber.full_name}</p>
                {selectedService && <p><strong>Hizmet:</strong> {selectedService.name} ({selectedService.duration_minutes} dk)</p>}
              </div>
              
              {selectedService ? (
                <AppointmentCalendar 
                  barber={selectedBarber} 
                  service={selectedService}
                  onAppointmentBooked={handleAppointmentBooked}
                />
              ) : (
                <>
                  <div className="profile-tabs">
                    <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Hizmetler</button>
                    <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Yorumlar</button>
                    <button className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Galeri</button>
                    <button className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>Konum</button>
                  </div>

                  <div className="tab-content">
                    {activeTab === 'services' && (
                      <div className="service-preview-list">
                        <h4>Mevcut Hizmetler</h4>
                        {selectedBarber.services && selectedBarber.services.length > 0 ? (
                          <ul>
                            {selectedBarber.services.map(service => (
                              <li 
                                key={service.id}
                                onClick={() => handleServiceClick(service)}
                                className={selectedService?.id === service.id ? 'selected' : ''}
                              >
                                <span>{service.name} ({service.duration_minutes} dk)</span>
                                <span className="price">{service.price} TL</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                           <p>Bu berberin tanımlı hizmeti yok.</p>
                        )}
                        <p className="service-selection-hint">Lütfen bir hizmet seçerek devam edin.</p>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="review-display-section">
                        <RatingSummary reviews={reviews} />
                        <h4>Müşteri Yorumları</h4>
                        {reviews.length > 0 ? (
                          <div className="review-list">
                            {reviews.map(review => (
                              <ReviewCard key={review.id} review={review} />
                            ))}
                          </div>
                        ) : (
                          <p>Bu berber için henüz yorum yapılmamış.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'gallery' && (
                      <div className="gallery-display-section">
                        <h4>Galeri</h4>
                        <PhotoGallery photos={selectedBarber.gallery} />
                      </div>
                    )}

                    {activeTab === 'map' && (
                      <div className="map-display-section">
                        <h4>Konum</h4>
                        <MapDisplay lat={selectedBarber.latitude} lon={selectedBarber.longitude} shopName={selectedBarber.shop_name} />
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;