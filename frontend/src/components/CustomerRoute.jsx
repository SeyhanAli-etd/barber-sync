import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Sadece müşteri (customer) rolündeki kullanıcıların erişebileceği rotalar için.
// Berberler randevu alma / kendi randevularını müşteri gibi görüntüleme
// akışına bu route sayesinde erişemez.
const CustomerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return user?.role === 'customer' ? <Outlet /> : <Navigate to="/" />;
};

export default CustomerRoute;