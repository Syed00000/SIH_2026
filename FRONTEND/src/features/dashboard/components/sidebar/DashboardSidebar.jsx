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
  Menu
} from 'lucide-react';

export const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarExpanded,
  setIsSidebarExpanded,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submit-challenge', label: 'Submit Challenge', icon: Plus },
    { id: 'challenges', label: 'My Challenges', icon: FileText },
    { id: 'explore-challenges', label: 'Explore Challenges', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 px-3 pt-3.5 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3">
        {/* Navigation label & collapse toggle */}
        <div className="flex items-center justify-between pb-1 px-1">
          {isSidebarExpanded && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Navigation
            </span>
          )}
          <button
            onClick={() =>
              isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsSidebarExpanded(!isSidebarExpanded)
            }
            className={`p-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors bg-white ${
              !isSidebarExpanded ? 'mx-auto' : ''
            }`}
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
              (item.id === 'submit-challenge' && activeTab === 'challenges_submit');

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
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <IconComponent
                  className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
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
      <div className="pt-2 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-md text-xs font-bold text-red-600 hover:bg-red-50 transition-all ${
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
