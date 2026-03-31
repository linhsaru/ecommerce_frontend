import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager, apiService } from '../services';

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
          // Call login API
          const { data: response } = await apiService.post('/auth/login', credentials);
          const payload = response?.data ?? response;

          const accessToken = payload?.accessToken;
          const refreshToken = payload?.refreshToken;
          const username = payload?.username;
          const role = payload?.role;

          if (accessToken) {
            tokenManager.setTokens(accessToken, refreshToken);
          }

          const tokenUser = tokenManager.getUserFromToken() || {};

          const user = {
            username: username || tokenUser.username,
            role: role || tokenUser.role,
            id: payload?.id || payload?.userId || tokenUser.id,
            ...tokenUser
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return payload;
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
          const { data } = await apiService.post('/auth/register', userData);

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

        // Clear cart to ensure logged-in user's cart is not leaked to guest
        import('./cartStore').then(({ useCartStore }) => {
          useCartStore.getState().clearCart();
        });
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
        const isAuthenticated = tokenManager.isAuthenticated();

        if (!isAuthenticated) {
          set({
            user: null,
            isAuthenticated: false,
          });
          return;
        }

        const tokenUser = tokenManager.getUserFromToken();
        const existingUser = get().user || {};

        const username = tokenUser?.username
          || existingUser.username
          || '';

        const user = {
          ...existingUser,
          ...tokenUser,
          username,
          role: tokenUser?.role || existingUser.role,
        };

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
