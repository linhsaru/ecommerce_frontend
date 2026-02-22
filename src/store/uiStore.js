import { create } from 'zustand';

const useUiStore = create((set, get) => ({
  // Loading states
  globalLoading: false,
  loadingStates: {},

  // Modal states
  modals: {},

  // Notification states
  notifications: [],

  // Sidebar/Drawer states
  sidebar: {
    isOpen: false,
    activeItem: null,
  },

  // Theme
  theme: 'light',

  // Actions
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  setLoadingState: (key, loading) => {
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },

  getLoadingState: (key) => {
    return get().loadingStates[key] || false;
  },

  // Modal management
  openModal: (modalId, data = {}) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalId]: {
          isOpen: true,
          data,
        },
      },
    }));
  },

  closeModal: (modalId) => {
    set(state => ({
      modals: {
        ...state.modals,
        [modalId]: {
          ...state.modals[modalId],
          isOpen: false,
        },
      },
    }));
  },

  getModalState: (modalId) => {
    return get().modals[modalId] || { isOpen: false, data: {} };
  },

  // Notification management
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      title: '',
      message: '',
      duration: 5000,
      ...notification,
    };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove notification
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Sidebar management
  toggleSidebar: () => {
    set(state => ({
      sidebar: {
        ...state.sidebar,
        isOpen: !state.sidebar.isOpen,
      },
    }));
  },

  openSidebar: () => {
    set(state => ({
      sidebar: {
        ...state.sidebar,
        isOpen: true,
      },
    }));
  },

  closeSidebar: () => {
    set(state => ({
      sidebar: {
        ...state.sidebar,
        isOpen: false,
      },
    }));
  },

  setActiveSidebarItem: (item) => {
    set(state => ({
      sidebar: {
        ...state.sidebar,
        activeItem: item,
      },
    }));
  },

  // Theme management
  setTheme: (theme) => {
    set({ theme });

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Store in localStorage
    localStorage.setItem('theme', theme);
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Initialize theme from localStorage
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    get().setTheme(savedTheme);
  },
}));

// Initialize theme on app start
if (typeof window !== 'undefined') {
  useUiStore.getState().initializeTheme();
}

export { useUiStore };
