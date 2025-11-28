import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Axios instance configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://v6.exchangerate-api.com/v6',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // API anahtarını client-side'da gösterme, server-side proxy kullan
    // Bu interceptor log ve debugging için kullanılabilir
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError) => {
    // Hata yönetimi
    if (error.response) {
      // Server hata yanıtı
      console.error('Response Error:', error.response.status, error.response.data);
      
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized - API key geçersiz');
          break;
        case 403:
          console.error('Forbidden - Erişim engellendi');
          break;
        case 404:
          console.error('Not Found - Endpoint bulunamadı');
          break;
        case 429:
          console.error('Rate Limit - Çok fazla istek');
          break;
        case 500:
          console.error('Server Error - Sunucu hatası');
          break;
        default:
          console.error('API Error:', error.message);
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('Network Error - Yanıt alınamadı');
    } else {
      // İstek hazırlanırken hata oluştu
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function for GET requests
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// Helper function for POST requests
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

// Helper function with retry logic
export const getWithRetry = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await get<T>(url, config);
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries} for ${url}`);
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw lastError;
};

export default api;
