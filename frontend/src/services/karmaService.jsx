import api from './api';

const API_BASE = '/api/social/karma';

export const karmaService = {
  getLeaderboard: async () => {
    const response = await api.get(`${API_BASE}/leaderboard`);
    return response.data;
  },

  getKarmaHistory: async (userId) => {
    const response = await api.get(`${API_BASE}/history/${userId}`);
    return response.data;
  },

  awardKarma: async (karmaData) => {
    const response = await api.post(`${API_BASE}/award`, karmaData);
    return response.data;
  }
};