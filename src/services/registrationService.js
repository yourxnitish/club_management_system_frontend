import api from './api';

export const registrationService = {
  register: async (eventId) => {
    const res = await api.post(`/registrations/event/${eventId}`);
    return res.data;
  },

  cancel: async (registrationId) => {
    const res = await api.delete(`/registrations/${registrationId}`);
    return res;
  },

  getMyRegistrations: async () => {
    const res = await api.get('/registrations/my-registrations');
    return res.data;
  },

  getEventRegistrations: async (eventId, params = {}) => {
    const res = await api.get(`/registrations/event/${eventId}`, { params });
    return res.data;
  },

  updateAttendance: async (registrationId, attended) => {
    const res = await api.patch('/registrations/attendance', { registrationId, attended });
    return res.data;
  },
};
