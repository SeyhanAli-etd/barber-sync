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

    // Eğer istek verisi FormData ise, Content-Type başlığını sil.
    // Bu, axios'un/tarayıcının doğru 'multipart/form-data' başlığını
    // gerekli 'boundary' ile birlikte otomatik olarak ayarlamasını sağlar.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;