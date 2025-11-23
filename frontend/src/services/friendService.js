import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const friendService = {
  // Search users
  searchUsers: async (query) => {
    try {
      const response = await api.get(`/friends/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    try {
      const response = await api.post(`/friends/request/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get friend requests
  getFriendRequests: async () => {
    try {
      const response = await api.get('/friends/requests');
      return response.data;
    } catch (error) {
      console.error('Error getting friend requests:', error.response?.data || error.message);
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/accept/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error accepting friend request:', error.response?.data || error.message);
      throw error;
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/reject/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting friend request:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get friends list
  getFriends: async () => {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error) {
      console.error('Error getting friends:', error.response?.data || error.message);
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      const response = await api.delete(`/friends/${friendId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing friend:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default friendService;
