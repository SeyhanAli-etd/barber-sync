import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BarberRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return user?.role === 'barber' ? <Outlet /> : <Navigate to="/" />;
};

export default BarberRoute;