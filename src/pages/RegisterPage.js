// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import Input from '../components/common/input';
import Button from '../components/common/button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess('');

    try {
      const response = await register(formData); // 🔁 Backend’e istek gönder
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login'); // 🧭 Başarılıysa giriş sayfasına yönlendir
      }, 2000);
    } catch (err) {
      console.error('Kayıt Hatası:', err);
      setError(err?.response?.data?.message || 'Kayıt işlemi başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Hesap Oluştur</h2>
        <p style={styles.subtitle}>Maceraya katılmak için ilk adımı at.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          {error && <p style={styles.errorMessage}>{error}</p>}
          {success && <p style={styles.successMessage}>{success}</p>}
          <div style={styles.inputGroup}>
            <Input id="firstName" name="firstName" label="Ad" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <Input id="lastName" name="lastName" label="Soyad" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <Input id="email" name="email" label="E-posta" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <Input id="password" name="password" label="Şifre" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <Button type="button" onClick={handleSubmit} disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
          </Button>
        </form>
        <p style={styles.footerText}>
          Zaten bir hesabın var mı? <Link to="/login" style={styles.link}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem', backgroundColor: '#f9f9f9' },
  formWrapper: { width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#555', marginTop: '-1rem', marginBottom: '2rem' },
  inputGroup: { marginBottom: '1.5rem' },
  errorMessage: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
  successMessage: { color: 'green', textAlign: 'center', marginBottom: '1rem' },
  footerText: { textAlign: 'center', marginTop: '1.5rem' },
  link: { color: '#5c8d89', fontWeight: 'bold', textDecoration: 'none' }
};

export default RegisterPage;
