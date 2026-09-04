import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

const DEFAULT_PREFERENCES = {
  defaultPriority: 'medium',
  defaultStatus: 'all',
  confirmDelete: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // User preferences stored in localStorage
  const [preferences, setPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem('taskflow_preferences');
    return savedPrefs ? JSON.parse(savedPrefs) : DEFAULT_PREFERENCES;
  });

  // Validate existing token on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      return { success: false, message: errorMsg };
    }
  };

  const updateUserProfile = async (name, email) => {
    try {
      const response = await api.put('/auth/profile', { name, email });
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Failed to update profile.';
      return { success: false, message: errorMsg };
    }
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Failed to update password.';
      return { success: false, message: errorMsg };
    }
  };

  const deleteUserAccount = async () => {
    try {
      await api.delete('/auth/account');
      logout();
      return { success: true, message: 'Account deleted' };
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Failed to delete account.';
      return { success: false, message: errorMsg };
    }
  };

  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem('taskflow_preferences', JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    preferences,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
    updatePreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
