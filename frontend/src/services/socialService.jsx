import api from './api';

const API_BASE = '/api/social';

export const socialService = {
  // Events
  getEvents: async (filters = {}) => {
    const response = await api.get(`${API_BASE}/events`, { params: filters });
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post(`${API_BASE}/events`, eventData);
    return response.data.event;
  },

  joinEvent: async (eventId) => {
    const response = await api.post(`${API_BASE}/events/${eventId}/join`);
    return response.data;
  },

  // Feed
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`${API_BASE}/feed/posts`, {
      params: { page, limit }
    });
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post(`${API_BASE}/feed/posts`, postData);
    return response.data.post;
  },

  addComment: async (postId, commentData) => {
    const response = await api.post(`${API_BASE}/feed/posts/${postId}/comments`, commentData);
    return response.data.comment;
  },

  // Karma
  getLeaderboard: async () => {
    const response = await api.get(`${API_BASE}/karma/leaderboard`);
    return response.data;
  },

  getKarmaHistory: async (userId) => {
    const response = await api.get(`${API_BASE}/karma/history/${userId}`);
    return response.data;
  }
};