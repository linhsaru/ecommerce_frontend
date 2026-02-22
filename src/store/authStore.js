import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '../services';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // This would typically be an API call
          // For now, we'll simulate it
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();

          // Set tokens
          tokenManager.setTokens(data.accessToken, data.refreshToken);

          // Set user data
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const data = await response.json();

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear tokens
        tokenManager.clearTokens();

        // Clear state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        // Clear persisted state
        get().clearPersistedState();
      },

      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData },
        }));
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state from tokens
      initializeAuth: () => {
        const user = tokenManager.getUserFromToken();
        const isAuthenticated = tokenManager.isAuthenticated();

        set({
          user,
          isAuthenticated,
        });
      },

      // Clear persisted state (helper method)
      clearPersistedState: () => {
        // This will be handled by persist middleware
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth state on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}

export { useAuthStore };
