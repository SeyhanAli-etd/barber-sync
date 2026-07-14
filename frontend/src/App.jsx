import React from 'react';
import { Routes, Route, NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BarbersListPage from './pages/BarbersListPage';
import PrivateRoute from './components/PrivateRoute';
import BookingPage from './pages/BookingPage';
import BarberDashboardPage from './pages/BarberDashboardPage';
import BarberRoute from './components/BarberRoute';
import CustomerAppointmentsPage from './pages/CustomerAppointmentsPage';
import RevenueDashboardPage from './pages/RevenueDashboardPage';
import PublicLandingPage from './pages/PublicLandingPage';
import BarberPublicProfilePage from './pages/BarberPublicProfilePage';
import ProfilePage from './pages/ProfilePage';

// Giriş yapmış kullanıcılar için ana layout (yerleşim)
function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <NotificationProvider>
      <NotificationDisplay />
      <header className="app-header">
        <NavLink to="/barbers" className="nav-brand">Barber-Sync</NavLink>
        <nav className="main-nav">
          <NavLink to="/booking">Randevu Al</NavLink>
          <NavLink to="/my-appointments">Randevularım</NavLink>
          {user?.role === 'barber' && <NavLink to="/dashboard">Randevu Paneli</NavLink>}
          
          {user?.role === 'barber' ? (
            <div className="nav-item-dropdown">
              <NavLink to="/profile" className="dropdown-toggle">Profil</NavLink>
              <div className="dropdown-menu">
                <NavLink to="/reports">Ciro Raporları</NavLink>
              </div>
            </div>
          ) : (
            <NavLink to="/profile">Profil</NavLink>
          )}
          <button onClick={logout} className="logout-btn">Çıkış Yap</button>
        </nav>
      </header>
      <main className="main-content">
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
      <Route path="/" element={<PublicLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/barber/:id" element={<BarberPublicProfilePage />} />

      {/* Korumalı Rotalar (AppLayout'u kullanır) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Navigate to="/barbers" replace />} /> {/* Eski / anasayfasına gidenleri yönlendir */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/barbers" element={<BarbersListPage />} />
          <Route path="/my-appointments" element={<CustomerAppointmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Sadece Berberlerin Erişebileceği Rotalar */}
          <Route element={<BarberRoute />}>
            <Route path="/dashboard" element={<BarberDashboardPage />} />
            <Route path="/reports" element={<RevenueDashboardPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
