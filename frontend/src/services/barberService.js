const API_URL = 'http://localhost:5000/api';

export const getBarbers = async () => {
  // Bu halka açık bir endpoint olduğu için token gerekmez.
  const response = await fetch(`${API_URL}/barbers`);

  if (!response.ok) {
    throw new Error('Berberler getirilemedi.');
  }

  return response.json();
};

export const getBarberById = async (id) => {
  const response = await fetch(`${API_URL}/barbers/${id}`);
  if (!response.ok) {
    throw new Error('Berber profili getirilemedi.');
  }
  return response.json();
};

export const getBarberAvailability = async (id, date) => {
  // date format should be YYYY-MM-DD
  const response = await fetch(`${API_URL}/barbers/${id}/availability?date=${date}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Müsaitlik durumu getirilemedi.');
  }
  return response.json();
};