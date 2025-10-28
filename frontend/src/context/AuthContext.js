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

      console.log('🔐 AuthContext init - savedToken exists:', !!savedToken);

      if (savedToken && savedUser) {
        try {
          // Ensure token is set on the api client before verification
          authService.setToken(savedToken);
          const userData = await authService.getMe();
          console.log('✅ Token verified with getMe()');
          setToken(savedToken);
          setUser(userData || savedUser);
        } catch (error) {
          // If getMe fails, check if it's a real auth error or a network error
          const status = error.response?.status;
          console.warn('⚠️ Failed to verify token on init, status:', status);
          
          if (status === 401) {
            // Token actually expired - clear it
            console.log('🔄 Token expired (401), clearing auth');
            removeFromLocalStorage('token');
            removeFromLocalStorage('user');
            authService.setToken(null);
          } else {
            // Network error, server down, or other transient issue
            // Trust the saved token/user - they'll be re-verified on next API call
            // The api interceptor will clear them if they're actually invalid
            console.log('🔄 Network error on getMe(), keeping token (will verify on next API call)');
            setToken(savedToken);
            setUser(savedUser);
          }
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
      console.log('📦 Backend response:', response);
      
      const { token: newToken, user: userData } = response;
      
      if (!newToken) {
        console.error('❌ No token in response:', response);
        return { 
          success: false, 
          message: 'Login failed: No token received from server' 
        };
      }

      console.log('✅ Login successful, user:', userData);
      
      setToken(newToken);
      setUser(userData);
      setToLocalStorage('token', newToken);
      setToLocalStorage('user', userData);
      authService.setToken(newToken);

      return { success: true };
    } catch (error) {
      console.error('❌ Login failed with error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('Error details:', errorMessage);
      return { 
        success: false, 
        message: errorMessage 
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