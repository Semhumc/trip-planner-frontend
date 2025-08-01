// src/pages/ProfilePage.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return <div style={styles.container}>Kullanıcı bilgileri yükleniyor...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <h1 style={styles.title}>Profil Bilgilerim</h1>
                <div style={styles.infoRow}>
                    <strong>Kullanıcı Adı:</strong>
                    <span>{userProfile.username}</span>
                </div>
                <div style={styles.infoRow}>
                    <strong>Ad:</strong>
                    <span>{userProfile.firstName}</span>
                </div>
                <div style={styles.infoRow}>
                    <strong>Soyad:</strong>
                    <span>{userProfile.lastName}</span>
                </div>
                <div style={styles.infoRow}>
                    <strong>E-posta:</strong>
                    <span>{userProfile.email}</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '700px', margin: '3rem auto', padding: '0 1rem' },
    profileCard: {
        backgroundColor: '#fff',
        padding: '2rem 3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    title: { textAlign: 'center', marginBottom: '2rem', fontFamily: "'Nunito', sans-serif" },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '1.1rem',
    },
};

export default ProfilePage;