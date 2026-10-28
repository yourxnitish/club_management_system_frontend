import api from './api';

export const eventService = {
  getAll: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },

  getUpcoming: async (limit = 6) => {
    const res = await api.get('/events/upcoming', { params: { limit } });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await api.get(`/events/slug/${slug}`);
    return res.data;
  },

  create: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },

  update: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },

  cancel: async (id) => {
    const res = await api.patch(`/events/${id}/cancel`);
    return res.data;
  },
};
