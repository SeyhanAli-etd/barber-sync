import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { geocodeAddress, reverseGeocode } from '../services/locationService';
import './MapAddressPicker.css';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS'i import et
import L from 'leaflet'; // Leaflet'in kendisini import et

// Harita görünümünü dinamik olarak değiştiren yardımcı bileşen
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Leaflet'in varsayılan ikon yolunu düzelt
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapAddressPicker = ({ initialValue, onLocationChange }) => {
  // Başlangıç değeri yoksa İstanbul'u merkez al
  const [position, setPosition] = useState(initialValue?.latitude ? [initialValue.latitude, initialValue.longitude] : [41.015137, 28.979530]);
  const [addressQuery, setAddressQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const markerRef = useRef(null);

  const handleSearch = async (e) => {
    // Eğer bir event ile tetiklendiyse, varsayılan form gönderme davranışını engelle
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!addressQuery) return;
    
    setIsLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const results = await geocodeAddress(addressQuery);
      if (results.length === 0) {
        setError('Bu adrese uygun konum bulunamadı.');
      }
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result) => {
    const newPosition = [result.lat, result.lon];
    setPosition(newPosition);
    setSearchResults([]); // Seçimden sonra sonuçları temizle
    onLocationChange({
      address: result.displayName,
      latitude: result.lat,
      longitude: result.lon,
    });
  };

  // Haritaya tıklandığında veya marker sürüklendiğinde konumu ve adresi güncelleyen fonksiyon
  const updateLocationFromMap = useCallback(
    async (lat, lon) => {
      setIsLoading(true);
      setError('');
      try {
        const address = await reverseGeocode(lat, lon);
        onLocationChange({
          address: address,
          latitude: lat,
          longitude: lon,
        });
      } catch (err) {
        setError('Adres bilgisi alınamadı.');
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationChange]
  );

  // Marker'ı sürüklenebilir yapmak için event handler
  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          updateLocationFromMap(lat, lng);
        }
      },
    }),
    [updateLocationFromMap]
  );

  // Harita tıklama olaylarını dinleyen bileşen
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        updateLocationFromMap(lat, lng);
      },
    });
    return null;
  };

  return (
    <div className="map-address-picker-container">
      <div className="address-search-form">
        <input
          type="text"
          value={addressQuery}
          onChange={(e) => setAddressQuery(e.target.value)}
          placeholder="Açık adres girin (örn: İstiklal Caddesi, Beyoğlu)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e);
            }
          }}
        />
        <button type="button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Aranıyor...' : 'Adresi Bul'}
        </button>
      </div>

      {error && <p className="search-error">{error}</p>}

      {searchResults.length > 0 && (
        <ul className="search-results-list">
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleSelectResult(result)}>
              {result.displayName}
            </li>
          ))}
        </ul>
      )}

      <MapContainer center={position} zoom={13} className="map-picker">
        <ChangeView center={position} zoom={15} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        <Marker
          draggable={true}
          eventHandlers={markerEventHandlers}
          position={position}
          ref={markerRef}
        />
      </MapContainer>
      <div className="selected-coordinates">
        Seçili Konum: Enlem: {position[0].toFixed(5)}, Boylam: {position[1].toFixed(5)}
      </div>
    </div>
  );
};

export default MapAddressPicker;