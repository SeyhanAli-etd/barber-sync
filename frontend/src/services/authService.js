import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Giriş yapılamadı.');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Kayıt işlemi başarısız.');
  }
};

export const getMe = async () => {
  try {
    // Token is automatically added by the axios interceptor in api.js
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    // Axios wraps the error, so we access the server's message like this
    const message = error.response?.data?.message || 'Kullanıcı oturumu doğrulanamadı.';
    throw new Error(message);
  }
};
