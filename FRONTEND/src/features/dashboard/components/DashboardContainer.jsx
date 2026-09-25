import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { LoginForm } from '../../auth/components/Login/LoginForm.jsx';
import { DashboardHeader } from './header/DashboardHeader.jsx';
import { DashboardSidebar } from './sidebar/DashboardSidebar.jsx';
import { DashboardFooter } from './footer/DashboardFooter.jsx';
import { CitizenDashboard } from './citizen/CitizenDashboard.jsx';
import { IndustryDashboard } from '../../industry/components/dashboard/IndustryDashboard.jsx';
import { IndustrySidebar } from '../../industry/components/layout/IndustrySidebar.jsx';
import { RoleProfile } from './RoleProfile.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

const ROLE_ROUTE_MAP = {
  WARD: '/ward',
  BLOCK: '/block',
  BUDGET_OFFICER: '/budget-officer',
  UNIVERSITY: '/university',
  HEI: '/university',
  GOVERNMENT: '/government',
  ADMIN: '/government',
  SUPER_ADMIN: '/government',
  CITIZEN: '/citizen',
  USER: '/citizen',
};

const getTargetRoute = (role, user) => {
  if (role === 'DEPARTMENT' || role.includes('DEPT')) {
    const dId = user?.deptId || user?.profile?.deptId || '';
    return dId ? `/department?deptId=${encodeURIComponent(dId)}` : '/department';
  }
  if (ROLE_ROUTE_MAP[role]) return ROLE_ROUTE_MAP[role];
  if (role.includes('TECH')) return '/technician';
  if (role.includes('NODAL')) return '/nodal';
  if (role.includes('FACULTY')) return '/faculty';
  return null;
};

export const DashboardContainer = ({ onNavigate }) => {
  const { user, loading, logout } = useAuth();
  const role = (user?.role || 'CITIZEN').toUpperCase();
  const [activeTab, setActiveTab] = useState(role === 'INDUSTRY' ? 'dashboard' : 'overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
    if (['/dashboard', '/', '/login'].includes(currentPath)) {
      const target = getTargetRoute(role, user);
      if (target) {
        if (onNavigate) onNavigate(target);
        else window.location.href = target;
      }
    }
  }, [role, user, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-500">
        <span className="font-semibold text-xs">Loading JoharSetu Portal...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onNavigate={onNavigate} />;
  }

  const isRoleRedirecting = typeof window !== 'undefined' && 
    (window.location.pathname === '/dashboard' || window.location.pathname === '/' || window.location.pathname === '/login') && 
    role !== 'INDUSTRY';

  if (isRoleRedirecting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-500">
        <span className="font-semibold text-xs">Redirecting to designated portal...</span>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate('/login'); else window.location.href = '/login';
  };

  const handleVerifyEmail = () => {
    if (onNavigate) onNavigate('/verify-email', { email: user?.email });
    else window.location.href = `/verify-email?email=${encodeURIComponent(user?.email || '')}`;
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col h-screen overflow-hidden ${
      fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
    }`}>
      <DashboardHeader
        user={user}
        role={role}
        activeTab={activeTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {role === 'INDUSTRY' ? (
          <IndustrySidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            onLogout={handleLogout}
            companyName={user?.organizationName || user?.name || user?.fullName || 'Industry Partner'}
          />
        ) : (
          <DashboardSidebar
            role={role}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleLogout={handleLogout}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3.5 md:p-4.5 space-y-3.5 overflow-y-auto overflow-x-hidden min-h-0 bg-white">
            {user && !user.emailVerified && !user.emailVerification?.verified && (
              <Alert variant="warning" title="Email Unverified">
                <div className="flex items-center justify-between w-full text-xs">
                  <span>Your email address is unverified. Please verify to enable full portal privileges.</span>
                  <button
                    onClick={handleVerifyEmail}
                    className="bg-slate-900 text-white font-bold px-2.5 py-1 rounded text-[10px] hover:bg-slate-800 transition-colors ml-3 cursor-pointer shadow-2xs"
                  >
                    Verify Email
                  </button>
                </div>
              </Alert>
            )}

            {role === 'CITIZEN' ? (
              <CitizenDashboard activeTab={activeTab} setActiveTab={setActiveTab} user={user} role={role} />
            ) : role === 'INDUSTRY' ? (
              <IndustryDashboard activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
            ) : (
              <div className="space-y-4">
                {activeTab === 'overview' && <div className="space-y-4"><RoleProfile user={user} /></div>}
                {activeTab === 'profile' && <RoleProfile user={user} />}
                {activeTab === 'settings' && <AccountSettings user={user} />}
                {activeTab === 'challenges' && (
                  <Card className="bg-white border border-slate-200 text-center p-8 max-w-2xl mx-auto rounded-md shadow-2xs">
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-slate-900">Challenge Execution Module</CardTitle>
                      <CardDescription className="text-slate-500 text-xs max-w-md mx-auto">
                        Matching features will connect here for HEI/University accounts.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            )}
          </main>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
