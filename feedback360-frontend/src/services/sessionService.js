import api from './api';

export const sessionService = {
  getSessions: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc', search = '') => {
    const params = {
      page,
      size,
      sortBy,
      sortDir,
    };
    if (search) {
      params.search = search;
    }
    const response = await api.get('/api/sessions', { params });
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await api.get(`/api/sessions/${id}`);
    return response.data;
  }
};
