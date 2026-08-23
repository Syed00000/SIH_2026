import React from 'react';
import { createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { RootLayout } from './layout.jsx';
import { LoginForm, RegisterForm, useCurrentUser } from '../features/auth/index.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../shared/components/ui/card.jsx';
import { Badge } from '../shared/components/ui/badge.jsx';
import { Button } from '../shared/components/ui/button.jsx';

const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});

function IndexPage() {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading profile state...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          University Workflow & Resolution Portal
        </h1>
        <p className="text-lg text-slate-500">
          An AI-assisted administrative routing and problem resolution management platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate({ to: '/login' })} variant="primary">
            Get Started
          </Button>
          <Button onClick={() => navigate({ to: '/register' })} variant="outline">
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back to the administrative portal.
          </p>
        </div>
        <Badge variant="success">Active Session</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Session Info</CardTitle>
            <CardDescription>Details of the currently authenticated role</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
            <div>
              <strong>Role:</strong> <span className="capitalize">{user.role}</span>
            </div>
            <div>
              <strong>ID:</strong> {user.id}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Capability Abstraction</CardTitle>
            <CardDescription>Backend-driven analysis features are integrated</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
            <p>AI assists the ERP lifecycle across validation, classification, and routing.</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="ai">AI Classification</Badge>
              <Badge variant="ai">AI Routing</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <div className="py-12">
      <LoginForm onSuccess={() => window.location.replace('/')} />
    </div>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <div className="py-12">
      <RegisterForm onSuccess={() => window.location.replace('/login')} />
    </div>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute]);

export const router = createRouter({ routeTree });
