// This can remain as .js since it's just configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: `${API_BASE_URL}/auth`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // User
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  LEADERBOARD: `${API_BASE_URL}/users/leaderboard`,
  
  // Location
  LOCATION: `${API_BASE_URL}/location`,
  LOCATION_UPDATE: `${API_BASE_URL}/location/update`,
  LOCATION_HISTORY: (userId) => `${API_BASE_URL}/location/history/${userId}`,
  
  // Analytics
  ANALYTICS: `${API_BASE_URL}/analytics`,
  DASHBOARD: `${API_BASE_URL}/analytics/dashboard`,
  KARMA_METRICS: `${API_BASE_URL}/analytics/karma`,
  TRAFFIC_DATA: `${API_BASE_URL}/analytics/traffic`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'Something went wrong');
};