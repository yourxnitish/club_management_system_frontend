import api from './api';

export const membershipService = {
  apply: async (clubId, joinReason) => {
    const res = await api.post('/memberships/apply', { clubId, joinReason });
    return res.data;
  },

  getMyMemberships: async (status) => {
    const res = await api.get('/memberships/my-memberships', { params: { status } });
    return res.data;
  },

  cancel: async (membershipId) => {
    const res = await api.delete(`/memberships/${membershipId}`);
    return res;
  },

  getClubMemberships: async (clubId, params = {}) => {
    const res = await api.get(`/memberships/club/${clubId}`, { params });
    return res.data;
  },

  review: async (membershipId, status) => {
    const res = await api.patch(`/memberships/${membershipId}/review`, { status });
    return res.data;
  },
};
