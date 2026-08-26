import React, { useState, useEffect } from 'react';
import { RootLayout } from './layout.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { RegisterForm } from '../features/auth/components/RegisterForm.jsx';
import { VerifyEmail } from '../features/auth/components/VerifyEmail.jsx';
import { ForgotPassword } from '../features/auth/components/ForgotPassword.jsx';
import { ResetPassword } from '../features/auth/components/ResetPassword.jsx';
import { IndustryRegistrationPage } from '../features/auth/components/IndustryRegistrationPage.jsx';
import { DashboardContainer } from '../features/dashboard/components/DashboardContainer.jsx';

export function Router() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const params = Object.fromEntries(new URLSearchParams(window.location.search));
      setQueryParams(params);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, searchObj) => {
    let url = path;
    if (searchObj) {
      const searchStr = new URLSearchParams(searchObj).toString();
      url = `${path}?${searchStr}`;
    }
    window.history.pushState({}, '', url);
    setCurrentPath(path);
    if (searchObj) {
      setQueryParams(searchObj);
    } else {
      setQueryParams({});
    }
  };

  // Show loading indicator during initial auth resolution
  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center space-x-3 text-slate-600 font-semibold text-sm">
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Authenticating JoharSetu session...</span>
          </div>
        </div>
      </RootLayout>
    );
  }

  const renderComponent = () => {
    // 1. PUBLIC GUEST ROUTES (Redirect to /dashboard if already logged in)
    const publicRoutes = ['/login', '/register', '/register/industry', '/apply-industry', '/forgot-password', '/reset-password', '/verify-email'];
    if (publicRoutes.includes(currentPath)) {
      if (isAuthenticated) {
        return <DashboardContainer onNavigate={navigate} />;
      }

      switch (currentPath) {
        case '/login':
          return <LoginForm onNavigate={navigate} />;
        case '/register':
          return <RegisterForm onNavigate={navigate} />;
        case '/register/industry':
        case '/apply-industry':
          return <IndustryRegistrationPage onNavigate={navigate} />;
        case '/forgot-password':
          return <ForgotPassword onNavigate={navigate} />;
        case '/reset-password':
          return <ResetPassword emailQuery={queryParams.email} onNavigate={navigate} />;
        case '/verify-email':
          return <VerifyEmail emailQuery={queryParams.email} onNavigate={navigate} />;
        default:
          return <LoginForm onNavigate={navigate} />;
      }
    }

    // 3. PROTECTED ROUTES (/dashboard, /profile, /settings, /)
    // Redirect to /login if not authenticated
    if (!isAuthenticated) {
      return <LoginForm onNavigate={navigate} />;
    }

    return <DashboardContainer onNavigate={navigate} />;
  };

  return <RootLayout>{renderComponent()}</RootLayout>;
}

export default Router;
