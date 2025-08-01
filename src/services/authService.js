// src/services/authService.js - DOĞRU HALİ
import axios from 'axios';

const AUTH_API_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

export const login = (credentials) => {
  return apiClient.post('/login', credentials);
};



/**
 * Yeni kullanıcı bilgilerini backend'e göndererek kayıt oluşturur.
 * @param {object} userData - { firstName, lastName, email, password } içeren nesne.
 * @returns {Promise} Axios'tan dönen promise.
 */
export const register = (userData) => {
  return apiClient.post('/register', userData);
};

/**
 * Backend'deki session'ı sonlandırmak için istek atar.
 * Başarılı olursa backend kullanıcıyı logout sayfasına yönlendirir.
 */
export const logout = () => {
  window.location.href = `${AUTH_API_URL}/logout`;
};

/**
 * Mevcut session'a göre kullanıcı profilini getirir.
 * @returns {Promise<Object>} Kullanıcı verisi.
 */
export const getProfile = () => {
  return apiClient.get('/me');
};