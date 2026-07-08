import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (error) {
          // Token geçersiz veya süresi dolmuş olabilir.
          console.error(error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
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
