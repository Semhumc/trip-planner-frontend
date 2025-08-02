import axios from 'axios';

const AUTH_API_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

/**
 * Kullanıcı giriş yapmak için backend'e POST isteği gönderir.
 * @param {object} credentials - { username: string, password: string }
 * @returns {Promise} Axios'tan dönen promise.
 */
export const login = (credentials) => {
  return apiClient.post('/login', credentials);
};

/**
 * Yeni kullanıcı bilgilerini backend'e göndererek kayıt oluşturur.
 * @param {object} userData - { firstName, lastName, username, email, password } içeren nesne.
 * @returns {Promise} Axios'tan dönen promise.
 */
export const register = (userData) => {
  // Frontend'den gelen veriyi backend'in beklediği formata dönüştür
  const registerData = {
    firstname: userData.firstName,
    lastname: userData.lastName,
    username: userData.username,
    email: userData.email,
    password: userData.password
  };
  
  return apiClient.post('/register', registerData);
};

/**
 * Backend'deki session'ı sonlandırmak için istek atar.
 */
export const logout = () => {
  return apiClient.post('/logout');
};

/**
 * Mevcut session'a göre kullanıcı profilini getirir.
 * @returns {Promise<Object>} Kullanıcı verisi.
 */
export const getProfile = () => {
  return apiClient.get('/me');
};