// src/pages/DashboardPage.js
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

const styles = {
  container: { maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontSize: '2.5rem', color: '#3a3a3a', fontFamily: "'Nunito', sans-serif" },
  subtitle: { fontSize: '1.1rem', color: '#555' },
  main: { /* Ek stil gerekirse */ },
  linkContainer: { marginTop: '2rem', textAlign: 'center' },
  link: { color: '#5c8d89', textDecoration: 'none', fontWeight: '600' },
};

export default DashboardPage;