import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, errorHandler } from '../services';

/**
 * Custom hook for GET requests with React Query
 * @param {string} key - Query key
 * @param {string} url - API endpoint
 * @param {object} options - Additional query options
 */
export const useApiQuery = (key, url, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      try {
        const response = await apiService.get(url);
        return response.data;
      } catch (error) {
        throw errorHandler.handleApiError(error);
      }
    },
    ...options,
  });
};

/**
 * Custom hook for POST mutations
 * @param {string} url - API endpoint
 * @param {object} options - Additional mutation options
 */
export const useApiMutation = (url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await apiService.post(url, data);
        return response.data;
      } catch (error) {
        throw errorHandler.handleApiError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Custom hook for PUT mutations
 * @param {string} url - API endpoint
 * @param {object} options - Additional mutation options
 */
export const useApiUpdate = (url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const updateUrl = id ? `${url}/${id}` : url;
        const response = await apiService.put(updateUrl, data);
        return response.data;
      } catch (error) {
        throw errorHandler.handleApiError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Custom hook for DELETE mutations
 * @param {string} url - API endpoint
 * @param {object} options - Additional mutation options
 */
export const useApiDelete = (url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const deleteUrl = `${url}/${id}`;
        const response = await apiService.delete(deleteUrl);
        return response.data;
      } catch (error) {
        throw errorHandler.handleApiError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

/**
 * Custom hook for file uploads
 * @param {string} url - Upload endpoint
 * @param {object} options - Additional mutation options
 */
export const useApiUpload = (url, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      try {
        const response = await apiService.upload(url, file);
        return response.data;
      } catch (error) {
        throw errorHandler.handleApiError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
