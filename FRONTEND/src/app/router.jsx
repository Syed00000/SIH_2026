import React, { useState, useEffect } from 'react';
import { RootLayout } from './layout.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginForm } from '../features/auth/components/Login/LoginForm.jsx';
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
import { BudgetOfficerPortal } from '../features/budgetOfficer/BudgetOfficerPortal.jsx';
import { LandingPage } from '../features/landing/components/LandingPage.jsx';
import { AboutPage } from '../features/landing/components/AboutPage.jsx';
import { AboutJharkhandPage } from '../features/landing/components/AboutJharkhandPage.jsx';
import { ImpactPage } from '../features/landing/components/ImpactPage.jsx';
import { IndustryLandingPage } from '../features/landing/components/IndustryLandingPage.jsx';
import { InstitutionsPage } from '../features/landing/components/InstitutionsPage.jsx';
import { ContactPage } from '../features/landing/components/ContactPage.jsx';
import { JoharSetuAiAssistant } from '../shared/components/ai/JoharSetuAiAssistant.jsx';

export function Router() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setQueryParams(Object.fromEntries(new URLSearchParams(window.location.search)));
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, searchObj) => {
    let cleanPath = path;
    let combinedQuery = { ...(searchObj || {}) };
    if (path.includes('?')) {
      const [base, query] = path.split('?');
      cleanPath = base;
      combinedQuery = { ...Object.fromEntries(new URLSearchParams(query)), ...combinedQuery };
    }
    const searchStr = Object.keys(combinedQuery).length > 0
      ? `?${new URLSearchParams(combinedQuery).toString()}`
      : '';
    window.history.pushState({}, '', `${cleanPath}${searchStr}`);
    setCurrentPath(cleanPath);
    setQueryParams(combinedQuery);
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

  const renderPublicPage = () => {
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
  };

  const renderComponent = () => {
    const publicRoutes = [
      '/', '/landing', '/about', '/about-jharkhand', '/impact', '/industry', '/institutions', '/contact',
      '/login', '/register', '/register/industry', '/apply-industry',
      '/forgot-password', '/reset-password', '/verify-email'
    ];

    if (publicRoutes.includes(currentPath)) return renderPublicPage();

    const portalMap = [
      { prefix: '/citizen', roles: ['CITIZEN', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <CitizenPortal user={user} onLogout={handleLogout} /> },
      { prefix: '/nodal', roles: ['NODAL', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <NodalPortal user={user} onLogout={handleLogout} onNavigate={navigate} /> },
      { prefix: '/faculty', roles: ['FACULTY', 'UNIVERSITY', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <FacultyLayout user={user} onLogout={handleLogout} /> },
      { prefix: '/university', roles: ['UNIVERSITY', 'HEI', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <UniversityLayout user={user} onLogout={handleLogout} /> },
      { prefix: '/government', roles: ['GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <GovernmentLayout onLogout={handleLogout} /> },
      { prefix: '/department', roles: ['DEPARTMENT', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <DepartmentPortal user={user} onLogout={handleLogout} /> },
      { prefix: '/ward', roles: ['WARD', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN', 'BLOCK'], el: <WardPortal user={user} onLogout={handleLogout} onNavigate={navigate} /> },
      { prefix: '/block', roles: ['BLOCK', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <BlockPortal user={user} onLogout={handleLogout} /> },
      { prefix: '/technician', roles: ['TECHNICIAN', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <TechnicianPortal user={user} onLogout={handleLogout} /> },
      { prefix: '/budget-officer', roles: ['BUDGET_OFFICER', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <BudgetOfficerPortal user={user} onLogout={handleLogout} /> },
      { prefix: '/industry-portal', roles: ['INDUSTRY', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'], el: <DashboardContainer onNavigate={navigate} /> }
    ];

    for (const p of portalMap) {
      if (currentPath.startsWith(p.prefix)) {
        return <ProtectedRoute allowedRoles={p.roles} onNavigate={navigate}>{p.el}</ProtectedRoute>;
      }
    }

    return (
      <ProtectedRoute onNavigate={navigate}>
        <DashboardContainer onNavigate={navigate} />
      </ProtectedRoute>
    );
  };

  return (
    <RootLayout>
      {renderComponent()}
      <JoharSetuAiAssistant />
    </RootLayout>
  );
}

export default Router;
