import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import './AuthForm.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'customer', // Varsayılan rol
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="full_name">Tam Adınız:</label>
          <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Kayıt Tipi:</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange}>
            <option value="customer">Müşteri</option>
            <option value="barber">Berber</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" disabled={!!success} className="btn-success">Kayıt Ol</button>
      </form>
      <p className="form-switch">
        Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
};

export default RegisterPage;