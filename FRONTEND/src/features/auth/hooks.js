import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api.js';
import { setAccessToken } from '../../infrastructure/api/client.js';

const AUTH_QUERY_KEY = ['auth', 'user'];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        return response?.data || null;
      } catch {
        setAccessToken(null);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
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
