import api from '../api';

const SOCIAL_BASE = '/api/social';

export const socialService = {
  // Events
  getEvents: () => api.get(`${SOCIAL_BASE}/events`),
  createEvent: (eventData) => api.post(`${SOCIAL_BASE}/events`, eventData),
  joinEvent: (eventId) => api.post(`${SOCIAL_BASE}/events/${eventId}/join`),

  // Feed
  getFeed: (page = 1) => api.get(`${SOCIAL_BASE}/feed/posts?page=${page}`),
  createPost: (postData) => api.post(`${SOCIAL_BASE}/feed/posts`, postData),
  addComment: (postId, commentData) => 
    api.post(`${SOCIAL_BASE}/feed/posts/${postId}/comments`, commentData),

  // Karma
  getLeaderboard: () => api.get(`${SOCIAL_BASE}/karma/leaderboard`),
  getUserKarma: (userId) => api.get(`${SOCIAL_BASE}/karma/user/${userId}`)
};
