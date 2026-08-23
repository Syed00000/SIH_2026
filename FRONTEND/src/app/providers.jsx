import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router.jsx';
import { AuthProvider } from '../features/auth/AuthContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
