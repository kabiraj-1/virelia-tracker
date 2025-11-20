import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.auth.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.auth.login(credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.auth.getProfile();
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Store authentication data
  storeAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  },

  // Get stored user data
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
