import api from './api';

export const statService = {
  getPublicStats: async () => {
    const res = await api.get('/dashboard/public-stats');
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  getAuditLogs: async (params = {}) => {
    const res = await api.get('/dashboard/logs', { params });
    return res.data;
  },
};
