import React, { useState, useEffect } from 'react';
import { RootLayout } from './layout.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { RegisterForm } from '../features/auth/components/Register/RegisterForm.jsx';
import { VerifyEmail } from '../features/auth/components/VerifyEmail.jsx';
import { ForgotPassword } from '../features/auth/components/ForgotPassword.jsx';
import { ResetPassword } from '../features/auth/components/ResetPassword.jsx';
import { IndustryRegistrationPage } from '../features/auth/components/IndustryRegistrationPage.jsx';
import { DashboardContainer } from '../features/dashboard/components/DashboardContainer.jsx';
import { CitizenPortal } from '../features/citizen/CitizenPortal.jsx';
import { NodalPortal } from '../features/nodal/NodalPortal.jsx';
import { UniversityLayout } from '../features/university/components/layout/UniversityLayout.jsx';
import { FacultyLayout } from '../features/faculty/components/layout/FacultyLayout.jsx';
import { GovernmentLayout } from '../features/government/components/layout/GovernmentLayout.jsx';
import { DepartmentPortal } from '../features/department/DepartmentPortal.jsx';
import { BlockPortal } from '../features/block/BlockPortal.jsx';
import { WardPortal } from '../features/ward/WardPortal.jsx';
import { TechnicianPortal } from '../features/technician/TechnicianPortal.jsx';
import { LandingPage } from '../features/landing/components/LandingPage.jsx';
import { AboutPage } from '../features/landing/components/AboutPage.jsx';
import { AboutJharkhandPage } from '../features/landing/components/AboutJharkhandPage.jsx';
import { ImpactPage } from '../features/landing/components/ImpactPage.jsx';
import { IndustryLandingPage } from '../features/landing/components/IndustryLandingPage.jsx';
import { InstitutionsPage } from '../features/landing/components/InstitutionsPage.jsx';
import { ContactPage } from '../features/landing/components/ContactPage.jsx';

export function Router() {
  const { user, isAuthenticated, loading, logout } = useAuth();
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
    const searchStr = searchObj ? `?${new URLSearchParams(searchObj).toString()}` : '';
    window.history.pushState({}, '', `${path}${searchStr}`);
    setCurrentPath(path);
    setQueryParams(searchObj || {});
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="flex items-center space-x-3 text-slate-600 font-semibold text-sm">
            <span>Authenticating JoharSetu session...</span>
          </div>
        </div>
      </RootLayout>
    );
  }

  const renderComponent = () => {
    const publicRoutes = [
      '/', '/landing', '/about', '/about-jharkhand', '/impact', '/industry', '/institutions', '/contact',
      '/login', '/register', '/register/industry', '/apply-industry',
      '/forgot-password', '/reset-password', '/verify-email'
    ];

    if (publicRoutes.includes(currentPath)) {
      if (isAuthenticated) return <DashboardContainer onNavigate={navigate} />;
      switch (currentPath) {
        case '/':
        case '/landing': return <LandingPage onNavigate={navigate} />;
        case '/about': return <AboutPage onNavigate={navigate} />;
        case '/about-jharkhand': return <AboutJharkhandPage onNavigate={navigate} />;
        case '/impact': return <ImpactPage onNavigate={navigate} />;
        case '/industry': return <IndustryLandingPage onNavigate={navigate} />;
        case '/institutions': return <InstitutionsPage onNavigate={navigate} />;
        case '/contact': return <ContactPage onNavigate={navigate} />;
        case '/login': return <LoginForm onNavigate={navigate} />;
        case '/register': return <RegisterForm onNavigate={navigate} />;
        case '/register/industry':
        case '/apply-industry': return <IndustryRegistrationPage onNavigate={navigate} />;
        case '/forgot-password': return <ForgotPassword onNavigate={navigate} />;
        case '/reset-password': return <ResetPassword emailQuery={queryParams.email} onNavigate={navigate} />;
        case '/verify-email': return <VerifyEmail emailQuery={queryParams.email} onNavigate={navigate} />;
        default: return <LoginForm onNavigate={navigate} />;
      }
    }

    if (currentPath === '/citizen' || currentPath === '/citizen-portal') {
      return (
        <ProtectedRoute allowedRoles={['CITIZEN', 'GOVERNMENT', 'ADMIN']} onNavigate={navigate}>
          <CitizenPortal user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/nodal' || currentPath === '/nodal-portal') {
      return (
        <ProtectedRoute allowedRoles={['NODAL', 'GOVERNMENT', 'ADMIN']} onNavigate={navigate}>
          <NodalPortal user={user} onLogout={handleLogout} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/faculty' || currentPath === '/faculty-portal') {
      return (
        <ProtectedRoute allowedRoles={['FACULTY', 'UNIVERSITY', 'GOVERNMENT', 'ADMIN']} onNavigate={navigate}>
          <FacultyLayout user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/university' || currentPath === '/hei' || currentPath === '/university-portal') {
      return (
        <ProtectedRoute allowedRoles={['UNIVERSITY', 'HEI', 'GOVERNMENT', 'ADMIN']} onNavigate={navigate}>
          <UniversityLayout user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/government' || currentPath === '/admin' || currentPath === '/admin-portal') {
      return (
        <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN', 'SUPER_ADMIN']} onNavigate={navigate}>
          <GovernmentLayout onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/department' || currentPath === '/department-portal') {
      return (
        <ProtectedRoute allowedRoles={['DEPARTMENT', 'GOVERNMENT', 'ADMIN', 'NODAL', 'CITIZEN']} onNavigate={navigate}>
          <DepartmentPortal user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/ward' || currentPath === '/ward-portal') {
      return (
        <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN', 'NODAL', 'DEPARTMENT', 'CITIZEN', 'WARD', 'BLOCK']} onNavigate={navigate}>
          <WardPortal user={user} onLogout={handleLogout} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/block' || currentPath === '/block-portal') {
      return (
        <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN', 'NODAL', 'DEPARTMENT', 'CITIZEN', 'BLOCK', 'WARD']} onNavigate={navigate}>
          <BlockPortal user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    if (currentPath === '/technician' || currentPath === '/technician-portal') {
      return (
        <ProtectedRoute allowedRoles={['TECHNICIAN', 'GOVERNMENT', 'ADMIN', 'DEPARTMENT']} onNavigate={navigate}>
          <TechnicianPortal user={user} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute onNavigate={navigate}>
        <DashboardContainer onNavigate={navigate} />
      </ProtectedRoute>
    );
  };

  return <RootLayout>{renderComponent()}</RootLayout>;
}

export default Router;
