import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { DashboardHeader } from './header/DashboardHeader.jsx';
import { DashboardSidebar } from './sidebar/DashboardSidebar.jsx';
import { DashboardFooter } from './footer/DashboardFooter.jsx';
import { CitizenDashboard } from './citizen/CitizenDashboard.jsx';
import { CitizenPortal } from '../../citizen/CitizenPortal.jsx';
import { AITriageDashboard } from '../../government/components/triage/AITriageDashboard.jsx';
import { GovernmentLayout } from '../../government/components/layout/GovernmentLayout.jsx';
import { UniversityLayout } from '../../university/components/layout/UniversityLayout.jsx';
import { NodalPortal } from '../../nodal/NodalPortal.jsx';
import { RoleProfile } from './RoleProfile.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

export const DashboardContainer = ({ onNavigate }) => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-500">
        <span className="font-semibold text-xs">Loading JoharSetu Portal...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6 bg-white border border-slate-200 shadow-xs rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-900">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Please sign in to access your JoharSetu portal dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <Button
              onClick={() => (onNavigate ? onNavigate('/login') : (window.location.href = '/login'))}
              className="w-full py-2 rounded-md font-semibold text-xs cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
            >
              Sign In Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const role = (user.role || 'CITIZEN').toUpperCase();

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('/login');
    } else {
      window.location.href = '/login';
    }
  };

  // 1. Render Dedicated Portals
  const urlPortal = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('portal') : null;
  if (urlPortal === 'citizen' || role === 'CITIZEN') {
    return <CitizenPortal user={user} onLogout={handleLogout} />;
  }

  if (urlPortal === 'nodal' || role === 'NODAL' || role.includes('NODAL')) {
    return <NodalPortal user={user} onLogout={handleLogout} />;
  }

  if (urlPortal === 'university' || role === 'UNIVERSITY' || role === 'HEI') {
    return <UniversityLayout user={user} onLogout={handleLogout} />;
  }

  if (role === 'GOVERNMENT' || role === 'ADMIN') {
    return <GovernmentLayout onLogout={handleLogout} />;
  }

  return (
    <div
      className={`min-h-screen bg-slate-100/40 flex flex-col h-screen overflow-hidden ${
        fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Government Header */}
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

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* Navigation Sidebar */}
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

        {/* Content Area With Independent Scrolling & Fixed Bottom Footer */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50/70">
          {/* Scrollable Dashboard Viewport */}
          <main className="flex-1 p-3.5 md:p-4.5 space-y-3.5 overflow-y-auto min-h-0">
            {/* Email Verification Alert */}
            {!user.emailVerified && (
              <Alert variant="warning" title="Email Unverified">
                <div className="flex items-center justify-between w-full text-xs">
                  <span>
                    Your email address is unverified. Please verify to enable full portal privileges.
                  </span>
                  <button
                    onClick={() =>
                      onNavigate
                        ? onNavigate('/verify-email', { email: user.email })
                        : (window.location.href = `/verify-email?email=${encodeURIComponent(user.email)}`)
                    }
                    className="bg-slate-900 text-white font-bold px-2.5 py-1 rounded text-[10px] hover:bg-slate-800 transition-colors ml-3 cursor-pointer shadow-2xs"
                  >
                    Verify Email
                  </button>
                </div>
              </Alert>
            )}

            {/* Citizen Dashboard Module */}
            {role === 'CITIZEN' ? (
              <CitizenDashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                role={role}
              />
            ) : (
              /* Generic/Fallback for non-Citizen roles */
              <div className="space-y-4">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <RoleProfile user={user} />
                  </div>
                )}
                {activeTab === 'profile' && <RoleProfile user={user} />}
                {activeTab === 'settings' && <AccountSettings user={user} />}
                {activeTab === 'challenges' && (
                  <Card className="bg-white border border-slate-200 text-center p-8 max-w-2xl mx-auto rounded-md shadow-2xs">
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Challenge Execution Module
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-xs max-w-md mx-auto">
                        Matching features will connect here for HEI/University accounts.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            )}
          </main>

          {/* Fixed Non-Scrolling Bottom Footer */}
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
