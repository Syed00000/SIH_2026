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
      className={`bg-white border-r border-slate-200/90 px-3 pt-3.5 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-2xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-64 shadow-2xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-64' : 'w-16'}`}
    >
      <div className="space-y-3.5 overflow-y-auto pr-0.5 custom-scrollbar">
        {/* Top Header matching reference mockup */}
        <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100">
          {isSidebarExpanded && (
            <div className="min-w-0 pr-2">
              <div className="text-xs font-black text-slate-900 truncate uppercase tracking-tight font-sans">
                {universityName}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                HEI PORTAL NODE
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
            className={`p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors bg-white cursor-pointer shadow-2xs ${
              !isSidebarExpanded ? 'mx-auto' : ''
            }`}
            title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'faculty' && activeTab?.startsWith('faculty'));

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
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  {isSidebarExpanded && <span className="truncate tracking-tight">{item.label}</span>}
                </div>

                {item.badge && isSidebarExpanded && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${
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

      {/* Bottom Logout Item */}
      <div className="pt-2 border-t border-slate-100 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2.5 space-x-3 text-left' : 'p-2.5 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default UniversitySidebar;
