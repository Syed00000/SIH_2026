import React from 'react';
import { LayoutDashboard, Wrench, User, LogOut, Menu, X } from 'lucide-react';

export const TechnicianSidebar = ({
  activeTab = 'home',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  counts = { total: 0, pending: 0, active: 0 }
}) => {
  const navItems = [
    { id: 'home', label: 'Overview / Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Assigned Problems', icon: Wrench, badge: counts.pending > 0 ? counts.pending : null },
    { id: 'profile', label: 'Technician Profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-30 md:hidden"
        />
      )}

      <aside
        className={`bg-white border-r border-slate-200/90 px-2.5 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full shadow-2xs select-none ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl bg-white z-40'
            : 'hidden md:flex'
        } ${isSidebarExpanded ? 'md:w-60' : 'md:w-16'}`}
      >
        {/* Top Navigation Links */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
          <div className="flex items-center justify-between md:justify-end pb-1 px-1">
            <span className="text-xs font-bold text-slate-800 md:hidden">Menu Navigation</span>
            <button
              type="button"
              onClick={() => {
                if (isMobileMenuOpen && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                else if (setIsSidebarExpanded) setIsSidebarExpanded(!isSidebarExpanded);
              }}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition bg-white cursor-pointer shadow-2xs"
              title={isSidebarExpanded ? 'Collapse' : 'Expand'}
            >
              {isSidebarExpanded || isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
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
                  className={`w-full flex items-center justify-between rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSidebarExpanded || isMobileMenuOpen ? 'px-3 py-2 text-left' : 'p-2 justify-center'
                  } ${
                    isActive
                      ? 'bg-[#064e3b] text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {(isSidebarExpanded || isMobileMenuOpen) && (
                      <span className="truncate tracking-tight">{item.label}</span>
                    )}
                  </div>
                  {(isSidebarExpanded || isMobileMenuOpen) && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sign Out */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
              isSidebarExpanded || isMobileMenuOpen ? 'px-3 py-2 text-left space-x-2.5' : 'p-2 justify-center'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
            {(isSidebarExpanded || isMobileMenuOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default TechnicianSidebar;
