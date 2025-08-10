// src/services/tripService.js - AI işlemleri trip service üzerinden - 3 TEMA DESTEĞİ
import axios from 'axios';

const TRIP_API_URL = 'http://localhost:8085/api/v1/trip';

const apiClient = axios.create({
  baseURL: TRIP_API_URL,
  withCredentials: true,
});

/**
 * AI'dan trip planı oluşturur - artık 3 tema seçeneği döndürüyor
 * @param {object} promptData - AI'ya gönderilecek prompt verisi
 * @returns {Promise<Object>} AI'dan dönen rota planları (3 tema)
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
 * Artık sadece seçilen temayı kaydediyor, options array'ini ignore ediyor
 * @param {object} tripWithLocations - Trip ve location verisi (tek tema)
 * @returns {Promise<Object>}
 */
export const saveTrip = (tripWithLocations) => {
  // Sadece seçilen tema verisini gönder, options wrapper'ını kaldır
  const cleanTripData = {
    trip: tripWithLocations.trip,
    locations: tripWithLocations.locations || []
  };
  
  return apiClient.post('/save', cleanTripData);
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

/**
 * YENİ: Response formatı helper fonksiyonları
 * Backend'den gelen response'u normalize eder
 */

/**
 * 3 tema response'unu kontrol eder ve normalize eder
 * @param {Object} response - Backend'den gelen response
 * @returns {Object} Normalize edilmiş response
 */
export const normalizeTripsResponse = (response) => {
  // Yeni format kontrolü - 3 tema array'i
  if (response.data && response.data.trip_options && Array.isArray(response.data.trip_options)) {
    return {
      ...response,
      data: {
        trip_options: response.data.trip_options,
        total_options: response.data.trip_options.length,
        format: 'multi_theme'
      }
    };
  }
  
  // Eski format için backward compatibility
  if (response.data && response.data.trip && response.data.daily_plan) {
    return {
      ...response,
      data: {
        trip_options: [{
          theme: "Genel Kamp Rotası",
          description: "AI tarafından oluşturulmuş kamp rotası",
          trip: response.data.trip,
          daily_plan: response.data.daily_plan
        }],
        total_options: 1,
        format: 'single_theme'
      }
    };
  }
  
  // Hiçbir format uymuyorsa hata
  throw new Error('Beklenmeyen response formatı');
};

/**
 * DEPRECATED FUNCTIONS - Backward compatibility için
 * Bunlar eski frontend kodlarının çalışması için bırakıldı
 */

/**
 * @deprecated Artık generateTripPlan kullanın
 */
export const createTripPlan = (promptData) => {
  console.warn('createTripPlan deprecated, generateTripPlan kullanın');
  return generateTripPlan(promptData);
};

/**
 * @deprecated Artık saveTrip kullanın
 */
export const saveTripPlan = (tripData) => {
  console.warn('saveTripPlan deprecated, saveTrip kullanın');
  return saveTrip(tripData);
};