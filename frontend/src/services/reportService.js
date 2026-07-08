const API_URL = 'http://localhost:5000/api/reports';

export const getRevenueReport = async (token) => {
  const response = await fetch(`${API_URL}/revenue`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Ciro raporu getirilemedi.');
  }

  return response.json();
};