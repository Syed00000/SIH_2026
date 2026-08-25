import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api.js';
import { setAccessToken, getAccessToken, setRefreshToken, clearTokens, onUnauthorized } from '../../infrastructure/api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await authApi.getMe();
      if (response && response.data) {
        setUser(response.data);
      }
    } catch {
      setUser(null);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onUnauthorized(() => {
      setUser(null);
    });

    const existingToken = getAccessToken() || localStorage.getItem('joharsetu_token');
    const existingRefreshToken = localStorage.getItem('joharsetu_refresh_token');

    if (existingToken || existingRefreshToken) {
      if (existingToken) setAccessToken(existingToken);
      if (existingRefreshToken) setRefreshToken(existingRefreshToken);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setError(null);

    try {
      const response = await authApi.login({ email: (email || '').toLowerCase().trim(), password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      if (accessToken) setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (payload) => {
    setError(null);
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const verifyEmail = async (email, otp) => {
    setError(null);
    try {
      const response = await authApi.verifyEmail({ email, otp });
      const { accessToken, refreshToken, user: userData } = response.data || {};
      
      if (accessToken) setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      if (userData) setUser(userData);
      
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'OTP verification failed';
      setError(message);
      throw err;
    }
  };

  const resendOtp = async (email) => {
    setError(null);
    try {
      const response = await authApi.resendVerificationOtp({ email });
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Failed to resend OTP';
      setError(message);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      const response = await authApi.forgotPassword({ email });
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Failed to request password reset';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setError(null);
    try {
      const response = await authApi.resetPassword({ email, otp, newPassword });
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API failure
    } finally {
      setUser(null);
      clearTokens();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        verifyEmail,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        fetchCurrentUser
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

export default AuthProvider;
