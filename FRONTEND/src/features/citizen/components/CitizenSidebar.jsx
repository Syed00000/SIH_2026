import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  HelpCircle,
  LogOut,
  X,
  Menu
} from 'lucide-react';

export const CitizenSidebar = ({
  activeTab = 'home',
  setActiveTab,
  onSubmitClick,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  isSubmitOpen = false
}) => {
  const navItems = [
    { id: 'home', label: 'Overview / Home', icon: LayoutDashboard },
    { id: 'challenges', label: 'My Challenges', icon: FileText },
    { id: 'submit', label: 'Submit Challenge', icon: PlusCircle },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'guidelines', label: 'Help & Guidelines', icon: HelpCircle }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 px-2.5 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-2xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      {/* Top Navigation Area */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        {/* Collapse Toggle Bar */}
        <div className={`flex items-center ${isSidebarExpanded ? 'justify-end' : 'justify-center'} pb-1 px-1`}>
          <button
            onClick={() => {
              if (isMobileMenuOpen && setIsMobileMenuOpen) {
                setIsMobileMenuOpen(false);
              } else if (setIsSidebarExpanded) {
                setIsSidebarExpanded(!isSidebarExpanded);
              }
            }}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors bg-white cursor-pointer shadow-2xs"
            title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2 text-left' : 'p-2 justify-center'
                } ${
                  isActive
                    ? 'bg-[#064e3b] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <IconComponent
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  {isSidebarExpanded && (
                    <span className="truncate tracking-tight">{item.label}</span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pinned Logout Area */}
      <div className="mt-auto pt-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2 space-x-2.5 text-left' : 'p-2 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;
