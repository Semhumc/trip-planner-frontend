// src/services/tripService.js
import axios from 'axios';

const TRIP_API_URL = 'http://localhost:6000/api/v1/trip';

const apiClient = axios.create({
  baseURL: TRIP_API_URL,
  withCredentials: true,
});

/**
 * AI'dan alınan trip planını önizleme için backend'e gönderir
 * @param {object} tripData - Trip verisi
 * @returns {Promise<Object>}
 */
export const previewTrip = (tripData) => {
  return apiClient.post('/preview', tripData);
};

/**
 * Trip'i veritabanına kaydetmek için backend'e gönderir
 * @param {object} tripWithLocations - Trip ve location verisi
 * @returns {Promise<Object>}
 */
export const saveTrip = (tripWithLocations) => {
  return apiClient.post('/save', tripWithLocations);
};

/**
 * Kullanıcının tüm triplerini getirir
 * @returns {Promise<Array>}
 */
export const getMyTrips = () => {
  // Bu endpoint henüz trip-plan-service'de yok, eklenmesi gerekecek
  return apiClient.get('/list');
};

/**
 * Belirli bir trip'i siler
 * @param {string|number} tripId
 * @returns {Promise}
 */
export const deleteTrip = (tripId) => {
  // Bu endpoint henüz trip-plan-service'de yok, eklenmesi gerekecek
  return apiClient.delete(`/${tripId}`);
};