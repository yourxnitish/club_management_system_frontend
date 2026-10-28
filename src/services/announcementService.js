import api from './api';

export const announcementService = {
  getFeed: async (limit = 10) => {
    const res = await api.get('/announcements', { params: { limit } });
    return res.data;
  },

  getPublic: async (limit = 10) => {
    const res = await api.get('/announcements/public', { params: { limit } });
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res;
  },
};
