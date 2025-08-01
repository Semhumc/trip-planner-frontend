// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/authService';
import Input from '../components/common/input';
import Button from '../components/common/button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      // Giriş başarılı. AuthContext'in kendini yenilemesi için refreshUser'ı çağır.
      await auth.refreshUser();
      // Kullanıcıyı dashboard'a yönlendir.
      navigate('/dashboard');
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError(err.response?.data?.message || 'E-posta veya şifre hatalı.');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Giriş Yap</h2>
        <p style={styles.subtitle}>Maceraya kaldığın yerden devam et.</p>
        <form onSubmit={handleSubmit}>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <div style={styles.inputGroup}>
            <Input
              id="email"
              label="E-posta Adresi"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <Input
              id="password"
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <p style={styles.footerText}>
          Hesabın yok mu? <Link to="/register" style={styles.link}>Hemen Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

// Stil tanımlamaları
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem', backgroundColor: '#f9f9f9' },
    formWrapper: { width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', fontFamily: "'Nunito', sans-serif" },
    subtitle: { textAlign: 'center', color: '#555', marginTop: '-1rem', marginBottom: '2rem' },
    inputGroup: { marginBottom: '1.5rem' },
    errorMessage: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
    footerText: { textAlign: 'center', marginTop: '1.5rem' },
    link: { color: '#5c8d89', fontWeight: 'bold', textDecoration: 'none' }
};

export default LoginPage;