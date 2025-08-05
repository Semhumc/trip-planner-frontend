// src/pages/DashboardPage.js
// AÇIKLAMA: Bu versiyon, üst başlık alanını daha az dikey boşluk kullanacak
// şekilde daraltır ve daha kompakt bir görünüm sunar.

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TripPlannerForm from '../components/trip/TripPlannerForm';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { userProfile } = useAuth();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Hoş Geldin, {userProfile?.firstName || userProfile?.username}!</h2>
        <p style={styles.subtitle}>Yeni bir gezi planlamanın tam zamanı. Aşağıdaki formu doldurarak başlayabilirsin.</p>
      </header>
      <main style={styles.main}>
        <TripPlannerForm />
        <div style={styles.linkContainer}>
            <Link to="/my-trips" style={styles.link}>Veya mevcut gezilerini görüntüle →</Link>
        </div>
      </main>
    </div>
  );
};

// --- YENİLENMİŞ Stiller ---
const styles = {
  container: {
    width: '100%',
  },
  header: {
    textAlign: 'center',
    // DEĞİŞİKLİK: Üst ve alt boşlukları azaltarak başlık alanını daralttık.
    // Önceki değer: padding: '3rem 1rem 4rem 1rem'
    padding: '1.5rem 1rem 1.5rem 1rem',
  },
  title: {
    // DEĞİŞİKLİK: Yazı tipini hafifçe küçülterek daha kompakt bir görünüm sağladık.
    // Önceki değer: fontSize: '2.5rem'
    fontSize: '2.3rem',
    color: '#2c3e50',
    fontFamily: "'Nunito', sans-serif"
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
    marginTop: '0.5rem'
  },
  main: {
    // Bu alanın özel bir stile ihtiyacı yok.
  },
  linkContainer: {
    padding: '3rem 0 4rem 0',
    textAlign: 'center',
    backgroundColor: '#eef2f5', 
  },
  link: {
    color: '#5c8d89',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
};

export default DashboardPage;