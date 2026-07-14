import api from './api';

/**
 * Sistemdeki tüm aktif berberleri listeler.
 * @returns {Promise<Array>} Berber listesi.
 */
export const getAllBarbers = async () => {
  const response = await api.get('/barbers');
  return response.data;
};

/**
 * Belirli bir berberin detaylı profilini ve hizmetlerini getirir.
 * @param {string} barberId - Berberin ID'si.
 * @returns {Promise<Object>} Berber profili ve hizmetleri.
 */
export const getBarberById = async (barberId) => {
  const response = await api.get(`/barbers/${barberId}`);
  return response.data;
};

/**
 * Belirli bir berberin belirli bir tarihteki müsait saatlerini getirir.
 * @param {string} barberId - Berberin ID'si.
 * @param {string} date - 'YYYY-MM-DD' formatında tarih.
 * @param {number} duration - Hizmetin süresi (dakika).
 * @returns {Promise<Object>} Müsait saatleri içeren bir obje.
 */
export const getBarberAvailability = async (barberId, date, duration) => {
  const response = await api.get(`/barbers/${barberId}/availability`, { params: { date, duration } });
  return response.data;
};