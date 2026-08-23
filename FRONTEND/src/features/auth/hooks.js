import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from './api.js';
import { setAccessToken } from '../../infrastructure/api/client.js';

const AUTH_QUERY_KEY = ['auth', 'user'];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authApi.refresh();
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        
        // Since backend return format on /refresh is token only, we return a mock user profile 
        // to verify UI authorization flows or mock representation.
        // In full production this would call a separate profile endpoint.
        return {
          id: 'session-active',
          role: 'user', // Default role for standard validation
        };
      } catch {
        setAccessToken(null);
        return null;
      }
    },
    staleTime: Infinity, // Avoid refreshing automatically in background
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await authApi.register(userData);
      return response.data;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        setAccessToken(null);
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
      }
    },
  });
}

export function useRedirectIfAuthenticated(to = '/') {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to });
    }
  }, [user, isLoading, navigate, to]);

  return { user, isLoading };
}
