import { apiService } from './api';

export const chatApi = {
  sendMessage: async (message) => {
    try {
      // Send the user message to /api/chat endpoint
      const response = await apiService.post('/api/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chat API:', error);
      throw error;
    }
  },
};
