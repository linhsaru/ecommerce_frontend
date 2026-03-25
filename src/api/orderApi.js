import { API } from './axiosConfig';

export const orderApi = {
  createOrder: async (payload) => {
    try {
      const response = await API.post('/orders', payload);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const response = await API.get('/orders/my');
      return response;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  // Admin: fetch all orders
  getOrders: async () => {
    try {
      const response = await API.get('/orders');
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Admin: update order status
  updateOrderStatus: async (orderId, payload) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, payload);
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};
