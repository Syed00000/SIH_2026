import React from 'react';
import {
  LayoutDashboard,
  Plus,
  FileText,
  Search,
  Bell,
  User,
  HelpCircle,
  Settings,
  LogOut,
  X,
  Menu,
  Cpu,
  GraduationCap,
  Landmark,
  Map,
  Users,
  BarChart2,
  Sliders
} from 'lucide-react';

export const DashboardSidebar = ({
  role,
  activeTab,
  setActiveTab,
  isSidebarExpanded,
  setIsSidebarExpanded,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout
}) => {
  const isAdmin = role === 'ADMIN' || activeTab === 'ai-triage' || activeTab === 'overview_admin';

  const citizenNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submit-challenge', label: 'Submit Challenge', icon: Plus },
    { id: 'challenges', label: 'My Challenges', icon: FileText },
    { id: 'explore-challenges', label: 'Explore Challenges', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const adminNavItems = [
    { id: 'overview_admin', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-triage', label: 'AI Triage & Override', icon: Cpu },
    { id: 'hei-hub', label: 'HEI Hub', icon: GraduationCap },
    { id: 'csr-grants', label: 'CSR Grants', icon: Landmark },
    { id: 'gis-map', label: 'GIS Map', icon: Map },
    { id: 'user-admin', label: 'User Admin', icon: Users },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const navItems = isAdmin ? adminNavItems : citizenNavItems;

  return (
    <aside
      className={`border-r px-3 pt-3.5 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 ${
        isAdmin
          ? 'bg-[#0f172a] border-slate-800 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      } ${
        isMobileMenuOpen
          ? `absolute inset-y-0 left-0 w-60 shadow-xl ${isAdmin ? 'bg-[#0f172a]' : 'bg-white'} md:relative md:shadow-none`
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3">
        {/* Navigation label & collapse toggle */}
        <div className="flex items-center justify-between pb-1 px-1">
          {isSidebarExpanded && (
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isAdmin ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              {isAdmin ? 'Admin Console' : 'Navigation'}
            </span>
          )}
          <button
            onClick={() =>
              isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsSidebarExpanded(!isSidebarExpanded)
            }
            className={`p-1 border rounded-md transition-colors ${
              isAdmin
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900'
            } ${!isSidebarExpanded ? 'mx-auto' : ''}`}
            title={isSidebarExpanded ? 'Collapse' : 'Expand'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'submit-challenge' && activeTab === 'challenges_submit') ||
              (isAdmin && item.id === 'ai-triage' && activeTab === 'ai-triage');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'submit-challenge') {
                    setActiveTab('challenges');
                  } else {
                    setActiveTab(item.id);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center rounded-md text-xs font-semibold transition-all relative ${
                  isSidebarExpanded ? 'px-3 py-2 space-x-2.5 text-left' : 'p-2 justify-center'
                } ${
                  isAdmin
                    ? isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <IconComponent
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : isAdmin ? 'text-slate-400' : 'text-slate-500'
                  }`}
                />
                {isSidebarExpanded && (
                  <span className={`truncate ${isActive ? 'text-white font-bold' : ''}`}>
                    {item.label}
                  </span>
                )}
                {isSidebarExpanded && item.badge && (
                  <span className="ml-auto bg-red-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className={`pt-2 border-t ${isAdmin ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-md text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all ${
            isSidebarExpanded ? 'px-3 py-2 space-x-2.5 text-left' : 'p-2 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-red-500" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
