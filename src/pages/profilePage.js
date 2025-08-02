import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/input';
import Button from '../components/common/button';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Kullanıcı profilini yükle
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getCurrentUser();
            setUserProfile(response.data);
            setFormData({
                firstname: response.data.firstName || '',
                lastname: response.data.lastName || '',
                username: response.data.username || '',
                email: response.data.email || ''
            });
        } catch (err) {
            console.error('Profil yükleme hatası:', err);
            setError('Profil bilgileri yüklenemedi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async () => {
        try {
            setIsSaving(true);
            setError(null);
            setSuccess('');

            await updateCurrentUser(formData);
            setSuccess('Profil başarıyla güncellendi!');
            setIsEditing(false);
            
            // Profili yeniden yükle
            await loadUserProfile();
        } catch (err) {
            console.error('Profil güncelleme hatası:', err);
            setError(err.response?.data?.message || 'Profil güncellenemedi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
            return;
        }

        try {
            await deleteCurrentUser();
            alert('Hesabınız başarıyla silindi.');
            logout(); // AuthContext'ten logout çağır
            navigate('/');
        } catch (err) {
            console.error('Hesap silme hatası:', err);
            setError(err.response?.data?.message || 'Hesap silinemedi.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            firstname: userProfile?.firstName || '',
            lastname: userProfile?.lastName || '',
            username: userProfile?.username || '',
            email: userProfile?.email || ''
        });
        setError(null);
        setSuccess('');
    };

    if (isLoading) {
        return <div style={styles.container}>Profil bilgileri yükleniyor...</div>;
    }

    if (!userProfile) {
        return <div style={styles.container}>Kullanıcı bilgileri bulunamadı.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <h1 style={styles.title}>
                    {isEditing ? 'Profili Düzenle' : 'Profil Bilgilerim'}
                </h1>

                {error && <div style={styles.errorMessage}>{error}</div>}
                {success && <div style={styles.successMessage}>{success}</div>}

                {!isEditing ? (
                    // Görüntüleme Modu
                    <>
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
                        
                        <div style={styles.buttonGroup}>
                            <Button onClick={() => setIsEditing(true)} variant="primary">
                                Profili Düzenle
                            </Button>
                            <Button onClick={handleDeleteAccount} variant="secondary" style={{backgroundColor: '#d32f2f', color: 'white'}}>
                                Hesabı Sil
                            </Button>
                        </div>
                    </>
                ) : (
                    // Düzenleme Modu
                    <>
                        <div style={styles.inputGroup}>
                            <Input
                                id="firstname"
                                name="firstname"
                                label="Ad"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <Input
                                id="lastname"
                                name="lastname"
                                label="Soyad"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <Input
                                id="username"
                                name="username"
                                label="Kullanıcı Adı"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <Input
                                id="email"
                                name="email"
                                label="E-posta"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <Button 
                                onClick={handleUpdateProfile} 
                                disabled={isSaving}
                                variant="primary"
                            >
                                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </Button>
                            <Button onClick={handleCancelEdit} variant="secondary">
                                İptal
                            </Button>
                        </div>
                    </>
                )}
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
    inputGroup: {
        marginBottom: '1.5rem',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        justifyContent: 'center',
    },
    errorMessage: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '1rem',
    },
    successMessage: {
        color: '#2e7d32',
        backgroundColor: '#e8f5e9',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '1rem',
    },
};

export default ProfilePage;