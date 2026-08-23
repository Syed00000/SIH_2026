import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { RoleProfile } from './RoleProfile.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';
import { Badge } from '../../../shared/components/ui/badge.jsx';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  FileText, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

export const DashboardContainer = ({ onNavigate }) => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-500">
        <span className="font-semibold text-sm">Loading JoharSetu Dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 bg-white border border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Authentication Required</CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Please sign in to access your JoharSetu role dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
              className="w-full py-2.5 rounded-md font-semibold text-sm"
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

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'challenges', label: 'My Challenges', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* GLOBAL FIXED HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-bold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
              Government of Jharkhand
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">
              Department of Higher and Technical Education
            </p>
          </div>
        </div>

        {/* Portal Title on the Top Right */}
        <div className="flex items-center space-x-4">
          <span className="font-extrabold text-slate-900 text-sm md:text-base tracking-widest uppercase">
            JoharSetu
          </span>

          {/* Mobile hamburger menu indicator */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative h-[calc(100vh-72px)]">
        {/* SIDEBAR NAVIGATION (Unified Header with Profile + Toggle button) */}
        <aside
          className={`bg-white border-r border-slate-200 px-4 pt-4 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-300 h-full z-20 ${
            isMobileMenuOpen ? 'absolute inset-y-0 left-0 w-64 shadow-2xl bg-white md:relative md:shadow-none' : 'hidden md:flex'
          } ${isSidebarExpanded ? 'w-64' : 'w-20'}`}
        >
          <div className="space-y-4">
            {/* Unified Sidebar Header */}
            {isSidebarExpanded ? (
              <div className="flex items-start justify-between border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="truncate pr-2">
                  <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                    {user.fullName}
                  </span>
                  <div className="mt-1">
                    <Badge variant={role === 'CITIZEN' ? 'info' : role === 'UNIVERSITY' ? 'ai' : 'success'}>
                      {role}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsSidebarExpanded(false)}
                  className="p-1 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 transition-colors flex-shrink-0 bg-white"
                  title="Collapse Sidebar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-b border-slate-100 pb-3">
                <button
                  onClick={() => setIsSidebarExpanded(true)}
                  className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Expand Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center rounded-md text-xs font-semibold transition-all ${
                      isSidebarExpanded ? 'px-4 py-2.5 space-x-3 text-left' : 'p-3 justify-center'
                    } ${
                      activeTab === item.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    {isSidebarExpanded && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button positioned at the bottom */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-md text-xs font-bold text-red-600 hover:bg-red-50 transition-all ${
                isSidebarExpanded ? 'px-4 py-2.5 space-x-3 text-left' : 'p-3 justify-center'
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {isSidebarExpanded && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto h-full">
          {/* Email Unverified Alert Bar */}
          {!user.emailVerified && (
            <Alert variant="warning" title="Email Unverified">
              <div className="flex items-center justify-between w-full">
                <span>Your email address is unverified. Please verify to enable full portal privileges.</span>
                <button
                  onClick={() => onNavigate ? onNavigate('/verify-email', { email: user.email }) : (window.location.href = `/verify-email?email=${encodeURIComponent(user.email)}`)}
                  className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded text-xs hover:bg-slate-800 transition-colors ml-4"
                >
                  Verify Email
                </button>
              </div>
            </Alert>
          )}

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome back, {user.fullName} 👋
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Role: <span className="font-bold text-slate-900">{role}</span> | Societal Innovation Hub
              </p>
            </div>

            <Button
              onClick={() => setActiveTab('challenges')}
              className="text-xs font-semibold px-4 py-2 rounded-md"
            >
              Submit Challenge
            </Button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white border border-slate-200 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Submitted Challenges
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900">0</span>
                </Card>
                <Card className="bg-white border border-slate-200 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    In Review
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900">0</span>
                </Card>
                <Card className="bg-white border border-slate-200 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Solved & Deployed
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900">0</span>
                </Card>
              </div>

              {/* Quick Profile Summary */}
              <RoleProfile user={user} />

              {/* My Challenges Placeholder */}
              <Card className="bg-white border border-slate-200 text-center p-8 space-y-4">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900">No Challenges Submitted Yet</CardTitle>
                  <CardDescription className="text-slate-500 text-xs max-w-sm mx-auto">
                    Submit local societal challenges or academic/CSR solutions to kickstart university matching.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button
                    onClick={() => setActiveTab('challenges')}
                    className="text-xs font-semibold px-5 py-2 rounded-md"
                  >
                    Submit Your First Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && <RoleProfile user={user} />}

          {/* MY CHALLENGES TAB */}
          {activeTab === 'challenges' && (
            <Card className="bg-white border border-slate-200 text-center p-10 space-y-4 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Challenge Execution Module</CardTitle>
                <CardDescription className="text-slate-500 text-xs max-w-md mx-auto">
                  Challenge submission, evidence validation, classification, and HEI matching features will connect here upon backend challenge module enablement.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <Badge variant="default" className="bg-slate-100 text-slate-800 border-slate-200">
                  Ready for API integration
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <Card className="bg-white border border-slate-200 text-center p-10 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Notifications</CardTitle>
                <CardDescription className="text-slate-500 text-xs">No new notifications at this time.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && <AccountSettings user={user} />}
        </main>
      </div>
    </div>
  );
};

export default DashboardContainer;
