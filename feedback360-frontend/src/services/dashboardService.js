import api from './api';

export const dashboardService = {
  getStatistics: async (filters = {}) => {
    const response = await api.get('/api/dashboard/statistics', { params: filters });
    return response.data;
  },

  getParticipantStatistics: async () => {
    const response = await api.get('/api/dashboard/participant');
    return response.data;
  }
};
