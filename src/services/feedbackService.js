import api from './api';

export const feedbackService = {
  submit: async (data) => {
    const res = await api.post('/feedbacks', data);
    return res.data;
  },

  getForEvent: async (eventId) => {
    const res = await api.get(`/feedbacks/event/${eventId}`);
    return res.data;
  },

  getForClub: async (clubId, params = {}) => {
    const res = await api.get(`/feedbacks/club/${clubId}`, { params });
    return res.data;
  },
};
