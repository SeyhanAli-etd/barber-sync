import api from './api';

// Berberin kendi hizmetlerini getirme
export const getMyServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

// Yeni hizmet oluşturma
export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

// Hizmeti güncelleme
export const updateService = async (serviceId, serviceData) => {
  const response = await api.put(`/services/${serviceId}`, serviceData);
  return response.data;
};

// Hizmeti silme (soft delete)
export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};