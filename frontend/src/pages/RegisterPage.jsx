import React, { useState } from 'react';
import { register } from '../services/authService';

const RegisterPage = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer', // Varsayılan rol
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await register(formData);
      setSuccess(data.message + ' Şimdi giriş yapabilirsiniz.');
      // 3 saniye sonra otomatik olarak giriş ekranına yönlendir
      setTimeout(() => {
        setShowLogin(true);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="full_name" style={{ display: 'block', marginBottom: '5px' }}>Tam Adınız:</label>
          <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>Kayıt Tipi:</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="customer">Müşteri</option>
            <option value="barber">Berber</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={!!success} style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Kayıt Ol</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Zaten bir hesabın var mı?{' '}
        <button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Giriş Yap
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;