import axios from 'axios';

const AI_API_URL = process.env.REACT_APP_AI_API_URL || 'http://localhost:9000/api/v1';

const apiClient = axios.create({
  baseURL: AI_API_URL,
  withCredentials: true,
});

/**
 * AI servisinden kamp rotası planı oluşturur
 * @param {object} promptData - AI'ya gönderilecek prompt verisi
 * @returns {Promise<Object>} AI'dan dönen rota planı
 */
export const generateTripPlan = (promptData) => {
  const requestData = {
    prompt: {
      user_id: promptData.userId,
      name: promptData.name,
      description: promptData.description,
      start_position: promptData.startPosition,
      end_position: promptData.endPosition,
      start_date: promptData.startDate,
      end_date: promptData.endDate
    }
  };
  
  return apiClient.post('/ai', requestData);
};