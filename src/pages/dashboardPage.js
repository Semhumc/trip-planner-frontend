// src/pages/DashboardPage.js - 3 TEMA MESAJLARI İLE GÜNCELLENDİ
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TripPlannerForm from '../components/trip/TripPlannerForm';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { userProfile } = useAuth();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Hoş Geldin, {userProfile?.firstName || userProfile?.username}! 🏕️</h2>
        <p style={styles.subtitle}>
          AI ile 3 farklı tema seçeneği oluştur ve en sevdiğini kaydet. 
          Her tema farklı bir macera sunuyor!
        </p>
        <div style={styles.featuresRow}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🌲</span>
            <span>Doğal Güzellikler</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🏰</span>
            <span>Tarihi Yerler</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⛰️</span>
            <span>Macera & Aksiyon</span>
          </div>
        </div>
      </header>
      
      <main style={styles.main}>
        <TripPlannerForm />
        <div style={styles.linkContainer}>
            <Link to="/my-trips" style={styles.link}>
              📋 Kayıtlı gezilerimi görüntüle →
            </Link>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  header: {
    textAlign: 'center',
    padding: '2rem 1rem 1rem 1rem',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderBottom: '1px solid #dee2e6'
  },
  title: {
    fontSize: '2.3rem',
    color: '#2c3e50',
    fontFamily: "'Nunito', sans-serif",
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#495057',
    marginTop: '0.5rem',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  featuresRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#fff',
    borderRadius: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '0.95rem',
    color: '#495057',
    fontWeight: '500',
    border: '1px solid #e9ecef'
  },
  featureIcon: {
    fontSize: '1.2rem'
  },
  main: {
    // Ana content alanı - TripPlannerForm kendi stilini yönetiyor
  },
  linkContainer: {
    padding: '2rem 0 3rem 0',
    textAlign: 'center',
    backgroundColor: '#f8f9fa', 
  },
  link: {
    color: '#5c8d89',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef',
    display: 'inline-block',
    transition: 'all 0.2s ease'
  }
};

export default DashboardPage;