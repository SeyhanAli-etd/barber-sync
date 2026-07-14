import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      // Bu effect sadece uygulama ilk yüklendiğinde çalışmalı.
      // `token` state'i yerine doğrudan localStorage'dan okuyoruz.
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          // Token geçersizse, temizle.
          console.error("Oturum doğrulaması başarısız:", error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []); // Bağımlılık dizisini boş bırakarak sadece ilk render'da çalışmasını sağlıyoruz.

  const login = async (email, password) => {
    const data = await apiLogin(email, password); // Sadece token döner
    localStorage.setItem('token', data.token);
    setToken(data.token);
    
    // ANA DÜZELTME: Token'ı aldıktan sonra kullanıcı bilgilerini hemen çek.
    // Axios interceptor'ı yeni token'ı otomatik olarak kullanacaktır.
    const userData = await getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const refreshUser = async () => {
    // Bu fonksiyon, kullanıcı verisini sunucudan yeniden çekerek state'in her zaman senkronize olmasını sağlar.
    // Profil güncellemesi gibi işlemlerden sonra tek doğruluk kaynağı olarak hareket eder.
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.error("Kullanıcı bilgisi yenilenirken hata:", error);
    }
  };

  const value = { token, user, login, logout, isAuthenticated: !!token, loading, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
