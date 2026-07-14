import api from './api';

/**
 * Yeni bir randevu oluşturur.
 * @param {Object} appointmentData - { barber_id, appointment_time, service_id }
 * @returns {Promise<Object>} Oluşturulan randevu.
 */
export const createAppointment = async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
};

/**
 * Giriş yapmış müşterinin randevularını getirir.
 */
export const getMyCustomerAppointments = async () => {
    const response = await api.get('/appointments/my-appointments');
    return response.data;
};

/**
 * Giriş yapmış berberin randevu taleplerini getirir.
 */
export const getMyBarberAppointments = async () => {
    const response = await api.get('/appointments/my-requests');
    return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
    return response.data;
};

export const completeAppointment = async (appointmentId, data) => {
    const response = await api.post(`/appointments/${appointmentId}/complete`, data);
    return response.data;
};