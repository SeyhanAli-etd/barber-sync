const API_URL = 'http://localhost:5000/api';

/**
 * Fetches the profile for the currently logged-in barber.
 * @param {string} token - The JWT token for authorization.
 * @returns {Promise<object|null>} The barber profile object or null if not found.
 */
export const getMyBarberProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No profile created yet, this is not an error.
    }
    throw new Error('Berber profili getirilemedi.');
  }

  return response.json();
};

export const upsertMyBarberProfile = async (profileData, token) => {
    const response = await fetch(`${API_URL}/profile/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profil güncellenemedi.');
    }

    return response.json();
}