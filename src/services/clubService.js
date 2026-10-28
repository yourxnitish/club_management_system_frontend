import api from './api';

export const clubService = {
  getAll: async (params = {}) => {
    const res = await api.get('/clubs', { params });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/clubs/categories');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/clubs/${id}`);
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await api.get(`/clubs/slug/${slug}`);
    return res.data;
  },

  getMyManagedClubs: async () => {
    const res = await api.get('/clubs/my-managed');
    return res.data;
  },

  create: async (clubData) => {
    const res = await api.post('/clubs', clubData);
    return res.data;
  },

  update: async (id, clubData) => {
    const res = await api.put(`/clubs/${id}`, clubData);
    return res.data;
  },

  assignAdmin: async (clubId, userId) => {
    const res = await api.post('/clubs/assign-admin', { clubId, userId });
    return res.data;
  },

  removeAdmin: async (clubId, userId) => {
    const res = await api.delete(`/clubs/${clubId}/admins/${userId}`);
    return res.data;
  },
};
