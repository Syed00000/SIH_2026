import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api.js';
import { setAccessToken, getAccessToken } from '../../infrastructure/api/client.js';

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
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingToken = getAccessToken() || localStorage.getItem('joharsetu_token');
    if (existingToken) {
      setAccessToken(existingToken);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email: (email || '').toLowerCase().trim(), password });
      const { accessToken, user: userData } = response.data;
      
      setAccessToken(accessToken);
      localStorage.setItem('joharsetu_token', accessToken);
      
      // Load full user profile from GET /api/v1/auth/me
      const meResponse = await authApi.getMe();
      const fullUser = meResponse?.data || userData;
      setUser(fullUser);
      
      return { success: true, user: fullUser };
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(payload);
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyEmail({ email, otp });
      const { accessToken, user: userData } = response.data || {};
      
      if (accessToken && userData) {
        setAccessToken(accessToken);
        localStorage.setItem('joharsetu_token', accessToken);
        setUser(userData);
      }
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'OTP verification failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
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
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.forgotPassword({ email });
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Failed to request password reset';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.resetPassword({ email, otp, newPassword });
      return response;
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || 'Password reset failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API failure
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('joharsetu_token');
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

export default AuthContext;
