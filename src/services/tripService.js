// src/services/tripService.js - AI işlemleri trip service üzerinden
import axios from 'axios';

const TRIP_API_URL = 'http://localhost:8085/api/v1/trip';

const apiClient = axios.create({
  baseURL: TRIP_API_URL,
  withCredentials: true,
});

/**
 * AI'dan trip planı oluşturur - artık trip service üzerinden
 * @param {object} promptData - AI'ya gönderilecek prompt verisi
 * @returns {Promise<Object>} AI'dan dönen rota planı
 */
export const generateTripPlan = (promptData) => {
  const requestData = {
    user_id: promptData.userId,
    name: promptData.name,
    description: promptData.description,
    start_position: promptData.startPosition,
    end_position: promptData.endPosition,
    start_date: promptData.startDate,
    end_date: promptData.endDate
  };
  
  return apiClient.post('/preview', requestData);
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
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Array>}
 */
export const getMyTrips = (userId) => {
  return apiClient.get(`/list?user_id=${userId}`);
};

/**
 * Belirli bir trip'i siler
 * @param {string|number} tripId
 * @returns {Promise}
 */
export const deleteTrip = (tripId) => {
  return apiClient.delete(`/${tripId}`);
};

/**
 * ID'ye göre trip getirir
 * @param {string|number} tripId
 * @returns {Promise}
 */
export const getTripById = (tripId) => {
  return apiClient.get(`/${tripId}`);
};