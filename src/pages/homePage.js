// src/pages/HomePage.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/button';
//import { Link } from 'react-router-dom';

const HomePage = () => {
    // Giriş ve kayıt fonksiyonlarını context'ten alıyoruz.
    const { login, register } = useAuth();

    return (
        <div style={styles.pageContainer}>
            <header style={styles.heroSection}>
                <h1 style={styles.heroTitle}>Hayalindeki Macerayı Planla</h1>
                <p style={styles.heroSubtitle}>
                    Kamp ve doğa gezilerinizi tek bir yerden kolayca organize edin, yeni rotalar keşfedin ve anılarınızı biriktirin.
                </p>
                <div style={styles.heroButtons}>
                    <Button onClick={register} variant="primary">Maceraya Başla</Button>
                    <Button onClick={login} variant="secondary">Giriş Yap</Button>
                </div>
            </header>

            <section style={styles.featuresSection}>
                <h2 style={styles.sectionTitle}>Neler Yapabilirsiniz?</h2>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>
                        <h3>Kolay Planlama</h3>
                        <p>Gideceğiniz yeri, tarihleri ve notlarınızı ekleyerek saniyeler içinde gezi planınızı oluşturun.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Tüm Gezileriniz Bir Arada</h3>
                        <p>Geçmiş ve gelecek tüm maceralarınızı tek bir panelden görüntüleyin ve yönetin.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Güvenli ve Özel</h3>
                        <p>Gezi planlarınız tamamen size özeldir ve güvenli bir şekilde saklanır.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Stil Tanımlamaları
const styles = {
    pageContainer: { fontFamily: "'Nunito', sans-serif" },
    heroSection: {
        textAlign: 'center',
        padding: '5rem 2rem',
        backgroundColor: '#f0e5d8', // Soft bej rengi
        color: '#3a3a3a',
    },
    heroTitle: { fontSize: '3rem', margin: '0 0 1rem 0' },
    heroSubtitle: { fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' },
    heroButtons: { display: 'flex', justifyContent: 'center', gap: '1rem' },
    featuresSection: { padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: { textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    featureCard: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
    },
};

export default HomePage;