import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Kullanıcı giriş yaptığında gösterilecek olan ana uygulama bölümü
function AuthenticatedApp() {
  const { user, logout } = useAuth();
  return (
    // NotificationProvider, kimlik doğrulaması yapılmış uygulamanın içinde olmalı
    // ki `useAuth` hook'unu kullanabilsin.
    <NotificationProvider>
      <NotificationDisplay />
      <h1>Barber-Sync'e Hoş Geldiniz, {user?.full_name || 'Kullanıcı'}!</h1>
      <button onClick={logout}>Çıkış Yap</button>
      {/* Gelecekte buraya <Router>, <HomePage> gibi bileşenler gelecek */}
    </NotificationProvider>
  );
}

// Kullanıcı giriş yapmadığında gösterilecek bölüm
function UnauthenticatedApp() {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <LoginPage setShowLogin={setShowLogin} />
  ) : (
    <RegisterPage setShowLogin={setShowLogin} />
  );
}

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Yükleniyor...</div>; // İlk token kontrolü sırasında bekleme ekranı
  }

  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default App;
