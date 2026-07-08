import React, { createContext, useState, useEffect } from 'react';
import { login as loginService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Gelecekte burada token'ı bir /me endpoint'i ile doğrulayabiliriz.
    // Şimdilik sadece localStorage'daki token'a güveniyoruz.
    if (token) {
      // Normalde token'ı decode edip user'ı set ederdik veya /me çağırısı yapardık.
      // Şimdilik basit tutuyoruz.
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user); // Login endpoint'i kullanıcı bilgisini de dönüyor.
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, login, logout, isAuthenticated: !!token, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

