import React from 'react';
import {
  Home,
  UserCheck,
  Share2,
  Briefcase,
  Rocket,
  FlaskConical,
  Users,
  FileKey,
  BarChart2,
  Settings,
  X,
  Menu,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'profile', label: 'Profile & Verification', icon: UserCheck },
  { id: 'collaboration', label: 'Collaboration Requests', icon: Share2, badgeCount: 8 },
  { id: 'projects', label: 'Active Projects', icon: Briefcase },
  { id: 'funding', label: 'Funding & Support', icon: Rocket },
  { id: 'testing', label: 'Testing & Labs', icon: FlaskConical },
  { id: 'experts', label: 'Experts & Engineers', icon: Users },
  { id: 'ip_transfer', label: 'IP & Technology Transfer', icon: FileKey },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const IndustrySidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  companyName = 'Tata Motors R&D',
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
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100">
          {isSidebarExpanded && (
            <div className="min-w-0 pr-2">
              <div className="text-xs font-black text-slate-900 truncate uppercase tracking-tight font-sans">
                {companyName}
              </div>
              <div className="text-[10px] text-[#007A61] font-extrabold uppercase tracking-wider mt-0.5 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007A61]" />
                <span>INDUSTRY NODE</span>
              </div>
            </div>
          )}
          <button
            type="button"
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
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2.5 text-left' : 'p-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-[#007A61] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50/60 hover:text-[#007A61]'
                }`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <div className="flex items-center">
                  <Icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-[#007A61]'
                    } ${isSidebarExpanded ? 'mr-3' : ''}`}
                  />
                  {isSidebarExpanded && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>
                {isSidebarExpanded && item.badgeCount && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badgeCount}
                  </span>
                )}
                
                {/* Mobile Notification Dot when collapsed */}
                {!isSidebarExpanded && item.badgeCount && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-100 mt-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onLogout) onLogout();
          }}
          className={`w-full flex items-center justify-center rounded-xl text-xs font-bold transition-all border cursor-pointer group ${
            isSidebarExpanded ? 'px-3 py-2.5 bg-red-50/50 border-red-100 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm' : 'p-2.5 border-transparent text-red-500 hover:bg-red-50'
          }`}
          title={!isSidebarExpanded ? 'Logout' : undefined}
        >
          <LogOut
            strokeWidth={2.5}
            className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              isSidebarExpanded ? 'mr-2' : ''
            }`}
          />
          {isSidebarExpanded && <span>Secure Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default IndustrySidebar;
