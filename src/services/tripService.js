import axios from 'axios';

// Go backend API'nizin ana URL'sini .env dosyasından almak en iyi pratiktir.
// Örn: REACT_APP_API_URL=http://localhost:8081/api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Özellikle API istekleri için yapılandırılmış bir axios istemcisi oluşturalım.
// Bu, authService'deki istemciden farklı olabilir veya aynı temel yapılandırmayı paylaşabilir.
const apiClient = axios.create({
  baseURL: API_URL,
  // EN ÖNEMLİ KISIM: Bu ayar, tarayıcının her istekte backend'den gelen
  // session cookie'sini otomatik olarak göndermesini sağlar. Bu olmadan,
  // backend sizin kim olduğunuzu bilemez.
  withCredentials: true,
});

/**
 * Yeni bir gezi planı oluşturmak için backend'e POST isteği gönderir.
 * @param {object} tripData - { destination: string, startDate: string, endDate: string } gibi gezi verilerini içerir.
 * @returns {Promise<Object>} Axios'tan dönen promise'i döndürür. Başarılı olursa, oluşturulan gezi verisini içerir.
 */
export const createTrip = (tripData) => {
  // apiClient, /trips endpoint'ine POST isteği atacak.
  // Gönderilen tam URL: http://localhost:8081/api/trips
  return apiClient.post('/trips', tripData);
};

/**
 * Giriş yapmış olan kullanıcının tüm gezilerini getirmek için GET isteği gönderir.
 * @returns {Promise<Array>} Gezileri içeren bir dizi ile sonuçlanan promise.
 */
export const getMyTrips = () => {
  return apiClient.get('/trips');
};

/**
 * Belirli bir geziyi ID'sine göre silmek için DELETE isteği gönderir.
 * @param {string | number} tripId - Silinecek olan gezinin benzersiz ID'si.
 * @returns {Promise}
 */
export const deleteTrip = (tripId) => {
  // Örnek URL: http://localhost:8081/api/trips/123
  return apiClient.delete(`/trips/${tripId}`);
};

/**
 * Mevcut bir geziyi güncellemek için PUT isteği gönderir. (Opsiyonel)
 * @param {string | number} tripId - Güncellenecek gezinin ID'si.
 * @param {object} tripData - Güncellenmiş gezi verileri.
 * @returns {Promise<Object>} Güncellenmiş gezi verisini içeren promise.
 */
export const updateTrip = (tripId, tripData) => {
  return apiClient.put(`/trips/${tripId}`, tripData);
};

// İhtiyaca göre getTripById gibi diğer fonksiyonları da buraya ekleyebilirsiniz.