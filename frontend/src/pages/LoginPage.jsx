import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = ({ setShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Başarılı girişte, App.jsx'teki koşullu renderlama sayesinde
      // uygulama otomatik olarak ana ekrana geçecek.
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Giriş Yap
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Hesabın yok mu?{' '}
        <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Kayıt ol
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
