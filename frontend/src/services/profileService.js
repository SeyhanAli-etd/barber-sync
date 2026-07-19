import api from './api';

/**
 * Fetches the profile for the currently logged-in barber.
 * @returns {Promise<object|null>} The barber profile object or null if not found.
 */
export const getMyBarberProfile = async () => {
  try {
    const response = await api.get('/profile/me');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    throw error;
  }
};

export const upsertMyBarberProfile = async (profileData) => {
    // Axios handles FormData Content-Type automatically
    const response = await api.put('/profile/me', profileData);
    return response.data;
}

// For Customers
export const getMyCustomerProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
}

export const updateMyCustomerProfile = async (profileData) => {
    // Axios handles FormData Content-Type automatically
    const response = await api.put('/users/me', profileData);
    return response.data;
}

/**
 * Deletes the currently logged-in user's account.
 * @returns {Promise<void>}
 */
export const deleteMyAccount = async () => {
    await api.delete('/users/me');
};
