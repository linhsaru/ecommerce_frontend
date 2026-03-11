import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
console.log('Base URL:', import.meta.env.VITE_API_URL);
const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Sử dụng biến môi trường cho baseURL
});

let isToken = false;

const handleTokenExpired = async (accessToken) => {
  const { exp } = jwtDecode(accessToken);
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  if (!isToken) {
    expiredTimer = window.setTimeout(() => {
      sessionStorage.removeItem('userSession');
    }, timeLeft);
    isToken = true;
  }
};

apiConfig.interceptors.request.use(
  async (config) => {
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
      handleTokenExpired(JSON.parse(userSession).accessToken);
      config.headers.Authorization = `Bearer ${JSON.parse(userSession).accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const API = {
  get: async (url, params = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for GET request');
      }
      const response = await apiConfig.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for POST request');
      }
      const response = await apiConfig.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for PUT request');
      }
      const response = await apiConfig.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for DELETE request');
      }

      const response = await apiConfig.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiConfig;
