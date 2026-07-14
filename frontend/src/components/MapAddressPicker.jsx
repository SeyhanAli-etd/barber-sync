import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapAddressPicker.css';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapAddressPicker = ({ initialLat, initialLon, onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const defaultCenter = { lat: 41.0082, lng: 28.9784 }; // Istanbul

  useEffect(() => {
    if (initialLat && initialLon) {
      setMarkerPosition({ lat: parseFloat(initialLat), lng: parseFloat(initialLon) });
    }
  }, [initialLat, initialLon]);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition = { lat, lng };
    setMarkerPosition(newPosition);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  const center = markerPosition || defaultCenter;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="map-address-picker-container">
        <div className="map-picker">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={markerPosition ? 15 : 10}
            onClick={handleMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
        {markerPosition && (
          <div className="selected-coordinates">
            Seçilen Konum: Enlem: {markerPosition.lat.toFixed(6)}, Boylam: {markerPosition.lng.toFixed(6)}
          </div>
        )}
        {!markerPosition && <p className="map-hint">Haritada bir yere tıklayarak konumunuzu seçin.</p>}
      </div>
    </LoadScript>
  );
};

export default MapAddressPicker;