import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getFromLocalStorage('token');
      const savedUser = getFromLocalStorage('user');

      if (savedToken && savedUser) {
        try {
          // Verify token is still valid
          const userData = await authService.getMe(savedToken);
          setToken(savedToken);
          setUser(userData);
          authService.setToken(savedToken);
        } catch (error) {
          // Token is invalid, clear storage
          removeFromLocalStorage('token');
          removeFromLocalStorage('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login with:', email);
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response;

      console.log('✅ Login successful, user:', userData);
      
      setToken(newToken);
      setUser(userData);
      setToLocalStorage('token', newToken);
      setToLocalStorage('user', userData);
      authService.setToken(newToken);

      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      const { token: newToken, user: userData } = response;

      setToken(newToken);
      setUser(userData);
      setToLocalStorage('token', newToken);
      setToLocalStorage('user', userData);
      authService.setToken(newToken);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeFromLocalStorage('token');
    removeFromLocalStorage('user');
    authService.setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};