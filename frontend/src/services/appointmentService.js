const API_URL = 'http://localhost:5000/api';

/**
 * Creates a new appointment.
 * @param {object} appointmentData - The data for the new appointment.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The created appointment object.
 */
export const createAppointment = async (appointmentData, token) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Randevu oluşturulamadı.');
  }

  return response.json();
};

/**
 * Fetches all appointments for the logged-in barber.
 * @param {string} token - The barber's JWT for authorization.
 * @returns {Promise<object[]>} A list of appointments.
 */
export const getMyBarberAppointments = async (token) => {
  const response = await fetch(`${API_URL}/appointments/my-requests`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Randevu talepleri getirilemedi.');
  }

  return response.json();
};

export const updateAppointmentStatus = async (appointmentId, status, token) => {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Randevu durumu güncellenemedi.');
  }

  return response.json();
};

/**
 * Fetches all appointments for the logged-in customer.
 * @param {string} token - The customer's JWT for authorization.
 * @returns {Promise<object[]>} A list of appointments.
 */
export const getMyCustomerAppointments = async (token) => {
  const response = await fetch(`${API_URL}/appointments/my-appointments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Randevularım getirilemedi.');
  }

  return response.json();
};

export const completeAppointment = async (appointmentId, data, token) => {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data), // data: { service_id, final_price? }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Randevu tamamlama işlemi başarısız.');
  }

  return response.json();
};