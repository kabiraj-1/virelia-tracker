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

const goalService = {
  // Get all goals
  getGoals: async () => {
    try {
      const response = await api.get('/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new goal
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update a goal
  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a goal
  deleteGoal: async (id) => {
    try {
      const response = await api.delete(`/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting goal:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default goalService;
