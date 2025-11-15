import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkApiStatus();
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH);
      if (response.ok) {
        setApiStatus('healthy');
      } else {
        setApiStatus('unhealthy');
      }
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setApiStatus('healthy');
      } else {
        console.log('Profile fetch failed, using demo mode');
        setUser({ name: 'Demo User', email: 'demo@virelia.com', karma: 1250 });
        setApiStatus('demo');
      }
    } catch (error) {
      console.log('Network error, using demo mode:', error.message);
      setUser({ name: 'Demo User', email: 'demo@virelia.com', karma: 1250 });
      setApiStatus('demo');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if we got any response
      if (!response) {
        throw new Error('No response from server - backend might be offline');
      }

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setApiStatus('healthy');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      // Fallback to demo mode
      const demoToken = 'demo-token-' + Date.now();
      setToken(demoToken);
      localStorage.setItem('token', demoToken);
      setUser({ name: 'Demo User', email, karma: 1250 });
      setApiStatus('demo');
      return { 
        success: true, 
        demo: true,
        message: 'Using demo mode - Backend API is currently offline'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration to:', API_ENDPOINTS.REGISTER);
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Check if we got any response
      if (!response) {
        throw new Error('No response from server - backend might be offline');
      }

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setApiStatus('healthy');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration network error:', error);
      // Fallback to demo mode
      const demoToken = 'demo-token-' + Date.now();
      setToken(demoToken);
      localStorage.setItem('token', demoToken);
      setUser({ name: userData.name, email: userData.email, karma: 100 });
      setApiStatus('demo');
      return { 
        success: true, 
        demo: true,
        message: 'Using demo mode - Backend API is currently offline. You can explore all features with demo data.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setApiStatus('checking');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    apiStatus,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
