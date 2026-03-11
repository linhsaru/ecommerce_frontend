/**
 * Token management utilities for JWT authentication
 */

export const tokenManager = {
  // Get access token
  getAccessToken: () => {
    return sessionStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken: () => {
    return sessionStorage.getItem('refreshToken');
  },

  // Set tokens
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
    }
  },

  // Clear tokens
  clearTokens: () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return false;

    try {
      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      console.error('Invalid token format:', error);
      return false;
    }
  },

  // Get user info from token
  getUserFromToken: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId || payload.sub,
        email: payload.email,
        role: payload.role,
        ...payload,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp <= currentTime;
    } catch (error) {
      return true;
    }
  },
};
