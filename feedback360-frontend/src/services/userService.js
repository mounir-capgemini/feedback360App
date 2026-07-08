import api from './api';

export const userService = {
  /**
   * Récupère la liste de tous les utilisateurs (admin uniquement).
   */
  getAllUsers: async (page = 0, size = 10) => {
    const response = await api.get('/api/users', { params: { page, size } });
    return response.data;
  },

  /**
   * Récupère le profil de l'utilisateur connecté.
   */
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  /**
   * Met à jour le profil de l'utilisateur connecté.
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
};
