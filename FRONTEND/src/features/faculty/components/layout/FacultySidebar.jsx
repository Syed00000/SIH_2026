import React from 'react';
import {
  Home,
  Layers,
  FileText,
  Users,
  Briefcase,
  User,
  Settings,
  LogOut,
  X,
  Menu,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'challenges', label: 'Assigned Challenges', icon: Layers },
  { id: 'projects', label: 'Projects Portfolio', icon: Briefcase },
  { id: 'revisions', label: 'Revision Requests', icon: RotateCcw, isAlert: true },
  { id: 'teams', label: 'Student Teams', icon: Users },
  { id: 'profile', label: 'Faculty Profile', icon: User }
];

export const FacultySidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  universityName = 'Ranchi University',
  facultyName = 'Dr. Binod Kumar',
  revisionCount = 0
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
              <div className="text-[10px] text-[#007A61] font-extrabold uppercase tracking-wider mt-0.5 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#007A61]" />
                <span>FACULTY NODE</span>
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
            const hasAlert = item.id === 'revisions' && revisionCount > 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab && setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2.5 text-left' : 'p-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-[#007A61] text-white shadow-xs'
                    : hasAlert
                    ? 'bg-amber-50/80 text-amber-900 hover:bg-amber-100/80 border border-amber-200/60'
                    : 'text-slate-700 hover:bg-emerald-50/60 hover:text-[#007A61]'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : hasAlert ? 'text-amber-600' : 'text-slate-500'}`} />
                    {!isSidebarExpanded && hasAlert && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
                    )}
                  </div>
                  {isSidebarExpanded && (
                    <span className="truncate tracking-tight font-sans">{item.label}</span>
                  )}
                </div>

                {isSidebarExpanded && hasAlert && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-emerald-900' : 'bg-amber-500 text-white shadow-2xs'
                  }`}>
                    {revisionCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Logout CTA matching reference */}
      <div className="pt-2 border-t border-slate-100 flex-shrink-0">
        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2.5 space-x-3' : 'p-2.5 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default FacultySidebar;
