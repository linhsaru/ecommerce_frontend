import axios from 'axios';

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7086';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Store new tokens
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data.message || 'Bad Request');
        case 403:
          throw new Error('Forbidden - You do not have permission');
        case 404:
          throw new Error('Resource not found');
        case 422:
          throw new Error(data.message || 'Validation failed');
        case 500:
          throw new Error('Internal server error');
        default:
          throw new Error(data.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error - Please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API methods
export const apiService = {
  // GET request
  get: (url, config = {}) => api.get(url, config),

  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),

  // File upload
  upload: (url, file, config = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
