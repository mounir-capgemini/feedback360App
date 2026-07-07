import api from './api';

export const notificationService = {
  getMyNotifications: async (page = 0, size = 10) => {
    const params = { page, size };
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  getPendingCount: async () => {
    const response = await api.get('/api/notifications/count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/api/notifications/${id}/read`);
    return response.data;
  }
};
