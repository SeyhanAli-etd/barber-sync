import React from 'react';
import { Routes, Route, NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './App.css';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import Logo from './components/Logo'; // Yeni Logo bileşenini import et
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BarbersListPage from './pages/BarbersListPage';
import PrivateRoute from './components/PrivateRoute';
import BookingPage from './pages/BookingPage';
import BarberDashboardPage from './pages/BarberDashboardPage';
import BarberRoute from './components/BarberRoute';
import CustomerRoute from './components/CustomerRoute';
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
        <Logo to="/barbers" />
        <nav className="main-nav">
          {/* "Randevu Al" linki sadece müşteriler için görünür. Berberler randevu alamaz. */}
          {user?.role === 'customer' && (
            <NavLink to="/booking">Randevu Al</NavLink>
          )}
          <NavLink to="/barbers">Berber Vitrini</NavLink>

          {/* Berberler için Randevu Talepleri linki ana menüye taşındı */}
          {user?.role === 'barber' && (
            <NavLink to="/dashboard">Randevu Talepleri</NavLink>
          )}

          {/* "Randevularım" linki role göre farklı sayfaya yönlendirir. */}
          {/* "Randevularım" linki sadece müşteriler için. */}
          
          <div className="nav-item-dropdown">
            <a href="#" className="dropdown-toggle" onClick={(e) => e.preventDefault()}>
              Profil
            </a>
            <div className="dropdown-menu">
              <NavLink to="/profile">
                {user?.role === 'customer' ? 'Profilim' : 'Profil Yönetimi'}
              </NavLink>
              {/* Customer-specific links */}
              {user?.role === 'customer' && (
                <NavLink to="/my-appointments">Randevularım</NavLink>
              )}
              {/* Barber-specific links */}
              {user?.role === 'barber' && (
                <NavLink to="/reports">Ciro Raporları</NavLink>
              )}
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="dropdown-logout-btn">
                Çıkış Yap
              </a>
            </div>
          </div>
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
          <Route path="/home" element={<Navigate to="/barbers" replace />} />
          <Route path="/barbers" element={<BarbersListPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Sadece Müşterilerin Erişebileceği Rotalar: Berberler randevu alamaz. */}
          <Route element={<CustomerRoute />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/my-appointments" element={<CustomerAppointmentsPage />} />
          </Route>

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
