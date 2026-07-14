import api from './api';

export const getRevenueReport = async () => {
  const response = await api.get('/reports/revenue');
  return response.data;
};

export const getMonthlySummary = async () => {
    const response = await api.get('/reports/monthly-summary');
    return response.data;
};