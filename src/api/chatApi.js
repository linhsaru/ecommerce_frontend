import { API } from './axiosConfig';

export const chatApi = {
  sendMessage: async (message) => {
    try {
      // Send the user message to /api/chat endpoint
      const response = await API.post('/api/chat', { message });
      return response;
    } catch (error) {
      console.error('Error sending message to chat API:', error);
      throw error;
    }
  },
};
