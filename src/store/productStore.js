import { create } from 'zustand';
import { apiService } from '../services';

export const useProductStore = create((set, get) => ({
  // State
  items: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
  search: '',
  status: '',
  isLoading: false,
  error: null,

  // Internal helper to normalize API response
  _normalizeResponse: (response) => {
    // Some APIs wrap payload inside `data`
    const root = response?.data ?? response;
    const payload = root?.data ?? root;

    // If payload has paging metadata
    if (payload && typeof payload === 'object' && 'items' in payload) {
      const {
        items,
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext,
        hasPrev,
      } = payload;

      return {
        items: items ?? [],
        page: page ?? 1,
        pageSize: pageSize ?? get().pageSize,
        totalItems: totalItems ?? (items?.length ?? 0),
        totalPages: totalPages ?? 1,
        hasNext: hasNext ?? false,
        hasPrev: hasPrev ?? false,
      };
    }

    // Fallback: treat payload as simple array
    const items = Array.isArray(payload) ? payload : [];
    return {
      items,
      page: 1,
      pageSize: items.length,
      totalItems: items.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };
  },

  // Actions
  setFilters: ({ search, status }) => {
    set((state) => ({
      search: search ?? state.search,
      status: status ?? state.status,
      page: 1, // reset về trang 1 khi đổi filter
    }));
  },

  setPage: (page) => {
    if (!page || page < 1) return;
    set({ page });
  },

  fetchProducts: async (options = {}) => {
    const { page, pageSize, search, status } = {
      page: get().page,
      pageSize: get().pageSize,
      search: get().search,
      status: get().status,
      ...options,
    };

    set({ isLoading: true, error: null });

    try {
      const numericStatus =
        status === '' || status === null || typeof status === 'undefined'
          ? undefined
          : Number(status);

      const { data: response } = await apiService.get('/products', {
        params: {
          page,
          pageSize,
          search: search || undefined,
          status: Number.isNaN(numericStatus) ? undefined : numericStatus,
        },
      });

      const normalized = get()._normalizeResponse(response);

      set({
        ...normalized,
        isLoading: false,
        error: null,
      });

      return normalized;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Không thể tải danh sách sản phẩm',
      });
      throw error;
    }
  },
}));


