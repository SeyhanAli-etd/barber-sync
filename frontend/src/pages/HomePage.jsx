import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  const containerStyle = {
    textAlign: 'center',
    padding: '50px 20px',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
  };

  const textStyle = {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
  };

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  };

  const linkStyle = {
    display: 'inline-block',
    padding: '15px 30px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Barber-Sync'e Hoş Geldiniz, {user?.full_name}!</h1>
      <p style={textStyle}>
        Randevu almanın en kolay yolu. Yakınınızdaki en iyi berberleri keşfedin ve tek tıkla randevunuzu oluşturun.
      </p>
      <div style={actionsStyle}>
        <Link to="/barbers" style={linkStyle}>Berberleri Görüntüle</Link>
        <Link to="/my-appointments" style={{ ...linkStyle, backgroundColor: '#6c757d' }}>Randevularım</Link>
      </div>
    </div>
  );
};

export default HomePage;