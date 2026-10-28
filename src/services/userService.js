import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (userData) => {
    const res = await api.put('/users/profile', userData);
    return res.data;
  },

  searchUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  toggleActive: async (userId, active) => {
    const res = await api.patch(`/users/${userId}/status`, null, { params: { active } });
    return res.data;
  },

  changeRole: async (userId, role) => {
    const res = await api.patch(`/users/${userId}/role`, null, { params: { role } });
    return res.data;
  },
};
