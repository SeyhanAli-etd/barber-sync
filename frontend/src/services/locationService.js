import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 5 // En fazla 5 sonuç göster
      }
    });
    // Gelen sonuçları daha kullanışlı bir formata çevir
    return response.data.map(item => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error('Adres bulunurken bir hata oluştu.');
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
    });
    // display_name, e.g., "1600 Amphitheatre Parkway, Mountain View, CA, USA"
    return response.data.display_name;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Adres bilgisi alınamadı."; // Return a fallback string
  }
};