// src/pages/UserManagementTestPage.js - TEST PAGE FOR USER MANAGEMENT
import React, { useState } from 'react';
import { 
    getCurrentUser, 
    updateCurrentUser, 
    deleteCurrentUser,
    getUserById,
    updateUserById,
    deleteUserById 
} from '../services/userService';
import Button from '../components/common/button';
import Input from '../components/common/input';

const UserManagementTestPage = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});
    const [testUserId, setTestUserId] = useState('');
    const [updateData, setUpdateData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: ''
    });

    const executeTest = async (testName, testFunction) => {
        setLoading(prev => ({ ...prev, [testName]: true }));
        try {
            const result = await testFunction();
            setResults(prev => ({ 
                ...prev, 
                [testName]: { 
                    success: true, 
                    data: result.data,
                    message: 'Test başarılı!'
                }
            }));
        } catch (error) {
            setResults(prev => ({ 
                ...prev, 
                [testName]: { 
                    success: false, 
                    error: error.response?.data || error.message,
                    message: 'Test başarısız!'
                }
            }));
        } finally {
            setLoading(prev => ({ ...prev, [testName]: false }));
        }
    };

    const tests = {
        // CURRENT USER TESTS
        getCurrentUser: () => executeTest('getCurrentUser', getCurrentUser),
        
        updateCurrentUser: () => executeTest('updateCurrentUser', () => 
            updateCurrentUser(updateData)
        ),
        
        deleteCurrentUser: () => {
            if (window.confirm('Gerçekten kendi hesabınızı silmek istiyor musunuz? Bu test amaçlıdır!')) {
                executeTest('deleteCurrentUser', deleteCurrentUser);
            }
        },

        // ADMIN USER TESTS
        getUserById: () => executeTest('getUserById', () => 
            getUserById(testUserId)
        ),
        
        updateUserById: () => executeTest('updateUserById', () => 
            updateUserById(testUserId, updateData)
        ),
        
        deleteUserById: () => {
            if (window.confirm(`Kullanıcı ${testUserId} silmek istiyor musunuz? Bu test amaçlıdır!`)) {
                executeTest('deleteUserById', () => deleteUserById(testUserId));
            }
        }
    };

    const renderResult = (testName) => {
        const result = results[testName];
        if (!result) return null;

        return (
            <div style={{
                ...styles.resultBox,
                backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
                borderColor: result.success ? '#4caf50' : '#f44336'
            }}>
                <h4 style={{ color: result.success ? '#2e7d32' : '#d32f2f' }}>
                    {result.message}
                </h4>
                {result.success ? (
                    <pre style={styles.jsonOutput}>
                        {JSON.stringify(result.data, null, 2)}
                    </pre>
                ) : (
                    <pre style={styles.errorOutput}>
                        {JSON.stringify(result.error, null, 2)}
                    </pre>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>User Management API Test Sayfası</h1>
            <p style={styles.subtitle}>
                Bu sayfa user management endpoint'lerini test etmek için oluşturulmuştur.
            </p>

            {/* Test Parameters */}
            <div style={styles.paramSection}>
                <h3>Test Parametreleri</h3>
                <div style={styles.paramGrid}>
                    <Input
                        id="testUserId"
                        label="Test User ID (Admin işlemler için)"
                        value={testUserId}
                        onChange={(e) => setTestUserId(e.target.value)}
                        placeholder="Örn: 12345-67890-abcdef"
                    />
                </div>
                
                <h4>Güncelleme Verileri (Update testleri için)</h4>
                <div style={styles.paramGrid}>
                    <Input
                        id="firstname"
                        label="Ad"
                        value={updateData.firstname}
                        onChange={(e) => setUpdateData({...updateData, firstname: e.target.value})}
                    />
                    <Input
                        id="lastname"
                        label="Soyad"
                        value={updateData.lastname}
                        onChange={(e) => setUpdateData({...updateData, lastname: e.target.value})}
                    />
                    <Input
                        id="username"
                        label="Kullanıcı Adı"
                        value={updateData.username}
                        onChange={(e) => setUpdateData({...updateData, username: e.target.value})}
                    />
                    <Input
                        id="email"
                        label="E-posta"
                        value={updateData.email}
                        onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                    />
                </div>
            </div>

            {/* Current User Tests */}
            <div style={styles.testSection}>
                <h3>Current User Endpoint Testleri</h3>
                <div style={styles.testGrid}>
                    <div style={styles.testItem}>
                        <h4>GET /user/me</h4>
                        <p>Giriş yapmış kullanıcının kendi bilgilerini getirir</p>
                        <Button 
                            onClick={tests.getCurrentUser}
                            disabled={loading.getCurrentUser}
                        >
                            {loading.getCurrentUser ? 'Test Ediliyor...' : 'Test Et'}
                        </Button>
                        {renderResult('getCurrentUser')}
                    </div>

                    <div style={styles.testItem}>
                        <h4>PUT /user/me</h4>
                        <p>Giriş yapmış kullanıcının kendi bilgilerini günceller</p>
                        <Button 
                            onClick={tests.updateCurrentUser}
                            disabled={loading.updateCurrentUser}
                        >
                            {loading.updateCurrentUser ? 'Test Ediliyor...' : 'Test Et'}
                        </Button>
                        {renderResult('updateCurrentUser')}
                    </div>

                    <div style={styles.testItem}>
                        <h4>DELETE /user/me</h4>
                        <p>Giriş yapmış kullanıcının kendi hesabını siler</p>
                        <Button 
                            onClick={tests.deleteCurrentUser}
                            disabled={loading.deleteCurrentUser}
                            variant="secondary"
                            style={{ backgroundColor: '#d32f2f', color: 'white' }}
                        >
                            {loading.deleteCurrentUser ? 'Test Ediliyor...' : 'Test Et (DİKKAT!)'}
                        </Button>
                        {renderResult('deleteCurrentUser')}
                    </div>
                </div>
            </div>

            {/* Admin User Tests */}
            <div style={styles.testSection}>
                <h3>Admin User Endpoint Testleri</h3>
                <div style={styles.testGrid}>
                    <div style={styles.testItem}>
                        <h4>GET /user/:id</h4>
                        <p>Belirli bir kullanıcıyı ID ile getirir</p>
                        <Button 
                            onClick={tests.getUserById}
                            disabled={loading.getUserById || !testUserId}
                        >
                            {loading.getUserById ? 'Test Ediliyor...' : 'Test Et'}
                        </Button>
                        {renderResult('getUserById')}
                    </div>

                    <div style={styles.testItem}>
                        <h4>PUT /user/:id</h4>
                        <p>Belirli bir kullanıcıyı günceller</p>
                        <Button 
                            onClick={tests.updateUserById}
                            disabled={loading.updateUserById || !testUserId}
                        >
                            {loading.updateUserById ? 'Test Ediliyor...' : 'Test Et'}
                        </Button>
                        {renderResult('updateUserById')}
                    </div>

                    <div style={styles.testItem}>
                        <h4>DELETE /user/:id</h4>
                        <p>Belirli bir kullanıcıyı siler</p>
                        <Button 
                            onClick={tests.deleteUserById}
                            disabled={loading.deleteUserById || !testUserId}
                            variant="secondary"
                            style={{ backgroundColor: '#d32f2f', color: 'white' }}
                        >
                            {loading.deleteUserById ? 'Test Ediliyor...' : 'Test Et (DİKKAT!)'}
                        </Button>
                        {renderResult('deleteUserById')}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1rem',
        fontFamily: "'Nunito', sans-serif",
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '2rem',
    },
    paramSection: {
        backgroundColor: '#f9f9f9',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
    },
    paramGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
    },
    testSection: {
        marginBottom: '3rem',
    },
    testGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem',
    },
    testItem: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    resultBox: {
        marginTop: '1rem',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid',
    },
    jsonOutput: {
        backgroundColor: '#f5f5f5',
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        overflow: 'auto',
        maxHeight: '200px',
    },
    errorOutput: {
        backgroundColor: '#ffebee',
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '0.85rem',
        overflow: 'auto',
        maxHeight: '200px',
        color: '#d32f2f',
    },
};

export default UserManagementTestPage;