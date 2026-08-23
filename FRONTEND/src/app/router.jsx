import React from 'react';
import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { RootLayout } from './layout.jsx';
import { LoginForm, RegisterForm } from '../features/auth/index.js';
import { DashboardContainer } from '../features/dashboard/index.js';

const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardContainer,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginForm,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterForm,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute]);

export const router = createRouter({ routeTree });
