import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('task_manager_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('task_manager_token');
      const savedUser = localStorage.getItem('task_manager_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify with backend
          const res = await axiosClient.get('/auth/me');
          if (res.data.success && res.data.data.user) {
            setUser(res.data.data.user);
            localStorage.setItem('task_manager_user', JSON.stringify(res.data.data.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.errors?.[0] || 'Login failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosClient.post('/auth/register', { name, email, password });
      const { user, token } = res.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data?.errors?.[0] || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
