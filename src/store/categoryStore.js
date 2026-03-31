import { create } from 'zustand';
import { apiService } from '../services';

export const useCategoryStore = create((set, get) => ({
  // State
  items: [],
  selectedCategory: null,
  search: '',
  isLoading: false,
  error: null,

  // Actions
  setFilters: (filters) => set({ ...filters }),
  setPage: (page) => set({ page }),

  fetchCategories: async (options = {}) => {
    const { search, parentId } = {
      search: get().search,
      parentId: null,
      ...options,
    };

    set({ isLoading: true, error: null });

    try {
      const { data: response } = await apiService.get('/categories', {
        params: {
          search: search || undefined,
          parentId: parentId || undefined,
        },
      });

      const root = response?.data ?? response;
      const payload = root?.data ?? root;
      const items = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload)
          ? payload
          : [];

      set({
        items,
        search,
        isLoading: false,
        error: null,
      });

      return items;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Không thể tải danh sách danh mục',
      });
      throw error;
    }
  },

  fetchCategoryById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data: response } = await apiService.get(`/categories/${id}`);
      const category = response?.data ?? response;
      set({ selectedCategory: category, isLoading: false, error: null });
      return category;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Không thể tải thông tin danh mục' });
      throw error;
    }
  },

  fetchCategoryBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const { data: response } = await apiService.get(`/categories/slug/${slug}`);
      const category = response?.data ?? response;
      set({ selectedCategory: category, isLoading: false, error: null });
      return category;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Không thể tải thông tin danh mục' });
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: response } = await apiService.post('/categories/category', categoryData);
      const newCategory = response?.data ?? response;

      set({ isLoading: false, error: null });
      return newCategory;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Không thể tạo danh mục' });
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: response } = await apiService.put(`/categories/${id}`, categoryData);
      const updatedCategory = response?.data ?? response;

      set({
        selectedCategory: updatedCategory,
        isLoading: false,
        error: null
      });
      return updatedCategory;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Không thể cập nhật danh mục' });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.delete(`/categories/${id}`);
      set({ isLoading: false, error: null });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Không thể xoá danh mục' });
      throw error;
    }
  },

  clearSelectedCategory: () => {
    set({ selectedCategory: null });
  }
}));
