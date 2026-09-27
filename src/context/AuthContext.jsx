// =========================================================
//  AuthContext — Global authentication state
// =========================================================

import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('learnflow_enrollments');
    localStorage.removeItem('learnflow_purchases');
  }, []);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch {
          clearAuthStorage();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [clearAuthStorage]);

  // Listen for forced logout events from the API interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      setCurrentUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('access_token', data.access);
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const data = await authService.signup({ name, email, password });
    localStorage.setItem('access_token', data.access);
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const requestOtp = useCallback(async (email) => {
    return await authService.requestOtp(email);
  }, []);

  const verifyOtp = useCallback(async ({ email, otp }) => {
    const data = await authService.verifyOtp({ email, otp });
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    clearAuthStorage();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, [clearAuthStorage]);

  const setAuthSession = useCallback(({ user, access, refresh }) => {
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      if (updated && updated.email) {
        setIsAuthenticated(true);
      }
      return updated;
    });
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    requestOtp,
    verifyOtp,
    logout,
    updateUser,
    setAuthSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export default AuthContext;
