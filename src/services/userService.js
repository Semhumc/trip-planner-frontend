import axios from 'axios';

const AUTH_API_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

// Request interceptor - Token'ı otomatik olarak ekle
apiClient.interceptors.request.use(
  (config) => {
    // Cookie'den token al ve header'a ekle
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// CURRENT USER OPERATIONS (Token ile kendi bilgilerini yönetme)

/**
 * Giriş yapmış kullanıcının kendi profilini getirir
 * @returns {Promise<Object>} Kullanıcı profil verisi
 */
export const getCurrentUser = () => {
  return apiClient.get('/user/me');
};

/**
 * Giriş yapmış kullanıcının kendi profilini günceller
 * @param {object} userData - { firstname, lastname, username, email }
 * @returns {Promise<Object>} Güncellenme sonucu
 */
export const updateCurrentUser = (userData) => {
  return apiClient.put('/user/me', userData);
};

/**
 * Giriş yapmış kullanıcının kendi hesabını siler
 * @returns {Promise<Object>} Silme sonucu
 */
export const deleteCurrentUser = () => {
  return apiClient.delete('/user/me');
};

// ADMIN USER OPERATIONS (ID ile diğer kullanıcıları yönetme)

/**
 * Belirli bir kullanıcıyı ID ile getirir (Admin işlemi)
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Object>} Kullanıcı verisi
 */
export const getUserById = (userId) => {
  return apiClient.get(`/user/${userId}`);
};

/**
 * Belirli bir kullanıcıyı günceller (Admin işlemi)
 * @param {string} userId - Kullanıcı ID'si
 * @param {object} userData - Güncellenecek veriler
 * @returns {Promise<Object>} Güncellenme sonucu
 */
export const updateUserById = (userId, userData) => {
  return apiClient.put(`/user/${userId}`, userData);
};

/**
 * Belirli bir kullanıcıyı siler (Admin işlemi)
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Object>} Silme sonucu
 */
export const deleteUserById = (userId) => {
  return apiClient.delete(`/user/${userId}`);
};

// UTILITY FUNCTIONS

/**
 * Tüm kullanıcıları listeler (Admin işlemi - backend'de implement edilmeli)
 * @returns {Promise<Array>} Kullanıcı listesi
 */
export const getAllUsers = () => {
  return apiClient.get('/user/list'); // Bu endpoint'i backend'de eklemeniz gerekebilir
};