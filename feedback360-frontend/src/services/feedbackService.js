import api from './api';

export const feedbackService = {
  submitFeedback: async (sessionId, comment, rating) => {
    const response = await api.post('/api/feedback', { sessionId, comment, rating });
    return response.data;
  },

  getFeedbacksBySession: async (sessionId, page = 0, size = 10) => {
    const params = { page, size };
    const response = await api.get(`/api/feedback/session/${sessionId}`, { params });
    return response.data;
  },

  getMyFeedbacks: async (page = 0, size = 10) => {
    const params = { page, size };
    const response = await api.get('/api/feedback/my', { params });
    return response.data;
  },

  getAllFeedbacks: async (page = 0, size = 10) => {
    const params = { page, size };
    const response = await api.get('/api/feedback/all', { params });
    return response.data;
  },

  exportFeedbacks: async () => {
    const response = await api.get('/api/feedback/export', { responseType: 'blob' });
    return response.data;
  }
};
