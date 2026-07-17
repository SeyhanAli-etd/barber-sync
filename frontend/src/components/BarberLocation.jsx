import React from 'react';
import './BarberLocation.css';

const BarberLocation = ({ address, latitude, longitude }) => {
  // Eğer adres veya koordinat bilgisi yoksa, bileşeni render etme
  if (!address || !latitude || !longitude) {
    return null;
  }

  // Hem masaüstü hem de mobilde çalışan bir Google Haritalar URL'si oluştur
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="location-info-container">
      <h5 className="location-title">Açık Adres</h5>
      <p className="location-address">{address}</p>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="directions-button">
        Yol Tarifi Al
      </a>
    </div>
  );
};

export default BarberLocation;