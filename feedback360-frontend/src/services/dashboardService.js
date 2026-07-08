import api from './api';

export const dashboardService = {
  getStatistics: async () => {
    const response = await api.get('/api/dashboard/statistics');
    return response.data;
  },

  getParticipantStatistics: async () => {
    const response = await api.get('/api/dashboard/participant');
    return response.data;
  }
};
