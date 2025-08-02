import React, { useState, useEffect } from 'react';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../../services/userService';
import Button from '../common/button';
import Input from '../common/input';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchUserId, setSearchUserId] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            // Not: getAllUsers endpoint'i backend'de implement edilmeli
            const response = await getAllUsers();
            setUsers(response.data || []);
        } catch (err) {
            console.error('Kullanıcı listesi yükleme hatası:', err);
            setError('Kullanıcı listesi yüklenemedi. ID ile arama yapabilirsiniz.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchUserId.trim()) {
            setError('Lütfen bir kullanıcı ID\'si girin.');
            return;
        }

        try {
            setError(null);
            const response = await getUserById(searchUserId);
            setSelectedUser(response.data);
        } catch (err) {
            console.error('Kullanıcı arama hatası:', err);
            setError('Kullanıcı bulunamadı.');
            setSelectedUser(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await deleteUserById(userId);
            alert('Kullanıcı başarıyla silindi.');
            setSelectedUser(null);
            loadUsers(); // Listeyi yenile
        } catch (err) {
            console.error('Kullanıcı silme hatası:', err);
            setError('Kullanıcı silinemedi.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Kullanıcı Yönetimi</h2>

            {error && <div style={styles.errorMessage}>{error}</div>}

            {/* Kullanıcı Arama */}
            <div style={styles.searchSection}>
                <h3>Kullanıcı Ara (ID ile)</h3>
                <div style={styles.searchBox}>
                    <Input
                        id="searchUserId"
                        label="Kullanıcı ID"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                        placeholder="Örn: 12345-67890-abcdef"
                    />
                    <Button onClick={handleSearchUser}>Ara</Button>
                </div>
            </div>

            {/* Seçili Kullanıcı Bilgileri */}
            {selectedUser && (
                <div style={styles.userCard}>
                    <h3>Kullanıcı Detayları</h3>
                    <div style={styles.userInfo}>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>Kullanıcı Adı:</strong> {selectedUser.username}</p>
                        <p><strong>Ad:</strong> {selectedUser.firstName}</p>
                        <p><strong>Soyad:</strong> {selectedUser.lastName}</p>
                        <p><strong>E-posta:</strong> {selectedUser.email}</p>
                        <p><strong>Aktif:</strong> {selectedUser.enabled ? 'Evet' : 'Hayır'}</p>
                    </div>
                    <div style={styles.buttonGroup}>
                        <Button onClick={() => handleDeleteUser(selectedUser.id)} variant="secondary" 
                                style={{backgroundColor: '#d32f2f', color: 'white'}}>
                            Kullanıcıyı Sil
                        </Button>
                    </div>
                </div>
            )}

            {/* Kullanıcı Listesi (eğer backend destekliyorsa) */}
            {!isLoading && users.length > 0 && (
                <div style={styles.userList}>
                    <h3>Tüm Kullanıcılar</h3>
                    {users.map(user => (
                        <div key={user.id} style={styles.userItem}>
                            <span>{user.username} - {user.email}</span>
                            <Button onClick={() => setSelectedUser(user)} variant="secondary">
                                Detay
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '0 1rem',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        fontFamily: "'Nunito', sans-serif",
    },
    searchSection: {
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
    },
    searchBox: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'end',
    },
    userCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    userInfo: {
        marginBottom: '1rem',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
    },
    userList: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    userItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
    },
    errorMessage: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '1rem',
    },
};

export default UserManagement;