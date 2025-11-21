import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is logged in (from localStorage or API)
    const savedUser = localStorage.getItem('virelia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - replace with actual API call
    const mockUser = {
      id: 1,
      email: email,
      name: 'Demo User',
      avatar: null,
      bio: 'Social tracker enthusiast',
      joinedAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    localStorage.setItem('virelia_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (userData) => {
    // Mock registration - replace with actual API
    const newUser = {
      id: Date.now(),
      ...userData,
      joinedAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('virelia_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('virelia_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('virelia_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
