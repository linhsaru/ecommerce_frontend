import { API } from './axiosConfig';

export const paymentApi = {
  /**
   * Called to generate the VNPay payment URL
   * @param {Object} payload { orderId: string, orderDescription: string }
   * @returns {Promise<{ isSuccess: boolean, data: { paymentUrl: string, ... } }>}
   */
  createVNPayUrl: async (payload) => {
    try {
      const response = await API.post('/payments/vnpay/create-url', payload);
      return response;
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
      const response = await API.get(`/payments/vnpay/verify${queryString}`);
      return response;
    } catch (error) {
      console.error('Error verifying VNPay return:', error);
      throw error;
    }
  },
};
