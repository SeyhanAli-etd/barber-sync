import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API'nizin temel URL'si
  headers: {
    'Content-Type': 'application/json',
  },
});

// API isteklerine token'ı otomatik olarak ekleyen bir interceptor (araya girici).
// Bu, korumalı endpoint'lere her istek gönderdiğimizde token'ı manuel olarak
// ekleme zahmetinden bizi kurtarır.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;