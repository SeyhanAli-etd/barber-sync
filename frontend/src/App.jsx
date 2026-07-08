import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import BarbersListPage from './pages/BarbersListPage';
import BarberDashboardPage from './pages/BarberDashboardPage';
import BarberRoute from './components/BarberRoute';
import BarberDetailPage from './pages/BarberDetailPage';
import ServiceManagementPage from './pages/ServiceManagementPage';
import CustomerAppointmentsPage from './pages/CustomerAppointmentsPage';
import RevenueDashboardPage from './pages/RevenueDashboardPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

// Giriş yapmış kullanıcılar için ana layout (yerleşim)
function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <NotificationProvider>
      <NotificationDisplay />
      <nav>
        <Link to="/">Ana Sayfa</Link> | <Link to="/barbers">Berberler</Link> |
        {user?.role === 'barber' && (
          <> <Link to="/dashboard">Randevu Paneli</Link> |{' '}
             <Link to="/manage-services">Hizmet Yönetimi</Link> |{' '}
             <Link to="/reports">Ciro Raporları</Link> |</>
        )}
        <Link to="/my-appointments">Randevularım</Link> |{' '}
        <Link to="/profile">Profil</Link> |{' '}
        <button onClick={logout}>Çıkış Yap</button>
      </nav>
      <hr />
      <main>
        {/* Alt rotalar (HomePage, BarbersListPage vb.) burada render edilecek */}
        <Outlet />
      </main>
    </NotificationProvider>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>; // İlk token kontrolü sırasında bekleme ekranı
  }

  return (
    <Routes>
      {/* Halka Açık Rotalar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Korumalı Rotalar (AppLayout'u kullanır) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/barbers" element={<BarbersListPage />} />
          <Route path="/barbers/:id" element={<BarberDetailPage />} />
          <Route path="/my-appointments" element={<CustomerAppointmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Sadece Berberlerin Erişebileceği Rotalar */}
          <Route element={<BarberRoute />}>
            <Route path="/dashboard" element={<BarberDashboardPage />} />
            <Route path="/manage-services" element={<ServiceManagementPage />} />
            <Route path="/reports" element={<RevenueDashboardPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
