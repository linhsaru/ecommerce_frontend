import { apiService } from './api';

export const orderApi = {
  createOrder: async (payload) => {
    try {
      const response = await apiService.post('/orders', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  lookupOrder: async (orderNo) => {
    try {
      const response = await apiService.get(`/orders/lookup/${orderNo}`);
      return response.data;
    } catch (error) {
      console.error('Error looking up order:', error);
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const response = await apiService.get('/orders/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  // Admin: fetch all orders
  getOrders: async () => {
    try {
      const response = await apiService.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Admin: update order status
  updateOrderStatus: async (orderId, payload) => {
    try {
      const response = await apiService.put(`/orders/${orderId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};
