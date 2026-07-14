import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapDisplay.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapDisplay = ({ lat, lon, shopName }) => {
  if (!lat || !lon) {
    return <div className="map-placeholder">Harita konumu belirtilmemiş.</div>;
  }

  const position = {
    lat: lat ? parseFloat(lat) : 0,
    lng: lon ? parseFloat(lon) : 0,
  };

  // API anahtarının .env dosyasından yüklendiğinden emin olun
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin.");
    return <div className="map-placeholder">Harita yüklenemedi: API anahtarı eksik.</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={15}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={position} title={shopName || 'Berber Dükkanı'} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapDisplay;
