const API_URL = 'http://localhost:5000/api/services';

export const getMyServices = async (token) => {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Hizmetler getirilemedi.');
  return response.json();
};

export const createService = async (serviceData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Hizmet oluşturulamadı.');
  }
  return response.json();
};

export const updateService = async (id, serviceData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Hizmet güncellenemedi.');
  }
  return response.json();
};

export const deleteService = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Hizmet silinemedi.');
  }
  // DELETE returns 204 No Content, so no JSON to parse
  return true;
};