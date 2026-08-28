import React from 'react';
import {
  Home,
  Layers,
  GraduationCap,
  Briefcase,
  Handshake,
  CheckCircle2,
  BarChart3,
  Bell,
  Landmark,
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'challenges', label: 'Assigned Challenges', icon: Layers },
  { id: 'faculty', label: 'Faculty Mentors', icon: GraduationCap },
  { id: 'projects', label: 'Projects Portfolio', icon: Briefcase },
  { id: 'partners', label: 'Industry Partners', icon: Handshake },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 7 },
  { id: 'profile', label: 'University Profile', icon: Landmark },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const UniversitySidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  universityName = 'Ranchi University'
}) => {
  return (
    <aside
      className={`bg-white border-r border-slate-200 px-3 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3 overflow-y-auto pr-0.5">
        <div className="flex items-center justify-between pb-1 px-1 border-b border-slate-100">
          {isSidebarExpanded && (
            <div className="min-w-0 pr-1">
              <div className="text-xs font-extrabold text-slate-900 truncate uppercase tracking-tight">
                {universityName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                HEI Portal Node
              </div>
            </div>
          )}
          <button
            onClick={() => {
              if (isMobileMenuOpen && setIsMobileMenuOpen) {
                setIsMobileMenuOpen(false);
              } else if (setIsSidebarExpanded) {
                setIsSidebarExpanded(!isSidebarExpanded);
              }
            }}
            className={`p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors bg-white cursor-pointer ${
              !isSidebarExpanded ? 'mx-auto' : ''
            }`}
            title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab && setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2.5 text-left' : 'p-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isSidebarExpanded && <span className="truncate tracking-tight">{item.label}</span>}
                </div>

                {item.badge && isSidebarExpanded && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-none ${
                      isActive ? 'bg-white text-slate-900' : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2 border-t border-slate-100 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2.5 space-x-2.5 text-left' : 'p-2.5 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-500" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default UniversitySidebar;
