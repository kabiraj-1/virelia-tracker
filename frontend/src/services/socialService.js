import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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

const socialService = {
  // Create post
  createPost: async (postData, files = []) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      
      if (postData.goalId) {
        formData.append('goalId', postData.goalId);
      }
      
      if (postData.scheduledPublish) {
        formData.append('scheduledPublish', postData.scheduledPublish);
      }
      
      if (postData.visibility) {
        formData.append('visibility', postData.visibility);
      }

      files.forEach(file => {
        formData.append('media', file);
      });

      const response = await api.post('/social/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get feed
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/social/feed?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting feed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Like/unlike post
  likePost: async (postId) => {
    try {
      const response = await api.post(`/social/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
      throw error;
    }
  },

  // Comment on post
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/social/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user posts
  getUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/social/posts/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user posts:', error.response?.data || error.message);
      throw error;
    }
  },

  // Schedule post
  schedulePost: async (postId, scheduledPublish) => {
    try {
      const response = await api.put(`/social/posts/${postId}/schedule`, { scheduledPublish });
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default socialService;
