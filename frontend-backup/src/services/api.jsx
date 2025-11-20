import { API_ENDPOINTS } from '../utils/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(endpoint, config);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request(API_ENDPOINTS.PROFILE);
  }

  // Location methods
  async updateLocation(locationData) {
    return this.request(API_ENDPOINTS.LOCATION_UPDATE, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async getLocation(userId) {
    return this.request(`${API_ENDPOINTS.LOCATION}/${userId}`);
  }

  // Analytics methods
  async getDashboardData() {
    return this.request(API_ENDPOINTS.DASHBOARD);
  }

  async getLeaderboard() {
    return this.request(`${API_ENDPOINTS.USERS}/leaderboard`);
  }

  // Update token method
  setToken(newToken) {
    this.token = newToken;
  }
}

export default new ApiService();