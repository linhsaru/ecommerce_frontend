import { apiService } from './api';

export const paymentApi = {
  createVietQr: async (payload) => {
    try {
      const response = await apiService.post('/payments/vietqr/create', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating VietQR payment:', error);
      throw error;
    }
  },

  getVietQrStatus: async ({ orderId, transactionRef }) => {
    try {
      const response = await apiService.get('/payments/vietqr/status', {
        params: { orderId, transactionRef },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking VietQR payment status:', error);
      throw error;
    }
  },

  confirmVietQrPayment: async ({ transactionRef, amount, description }) => {
    try {
      const response = await apiService.post('/payments/vietqr/confirm', {
        transactionRef,
        amount,
        description,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming VietQR payment:', error);
      throw error;
    }
  },

  /**
   * Called to generate the VNPay payment URL
   * @param {Object} payload { orderId: string, orderDescription: string }
   * @returns {Promise<{ isSuccess: boolean, data: { paymentUrl: string, ... } }>}
   */
  createVNPayUrl: async (payload) => {
    try {
      const response = await apiService.post('/payments/vnpay/create-url', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating VNPay URL:', error);
      throw error;
    }
  },

  /**
   * Called on the return URL (vnp_Returnurl) to let backend verify the signature
   * @param {string} queryString e.g. "?vnp_Amount=...&vnp_TxnRef=..."
   */
  verifyVNPayReturn: async (queryString) => {
    try {
      const response = await apiService.get(`/payments/vnpay/verify${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying VNPay return:', error);
      throw error;
    }
  },
};
