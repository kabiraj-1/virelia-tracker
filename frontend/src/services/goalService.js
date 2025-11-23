import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const goalService = {
  // Get all goals
  getGoals: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/goals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Create a new goal
  createGoal: async (goalData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/goals`, goalData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update a goal
  updateGoal: async (id, goalData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/goals/${id}`, goalData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete a goal
  deleteGoal: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default goalService;
