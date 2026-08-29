import React from 'react';
import {
  Home,
  Layers,
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview Panel', icon: Home },
  { id: 'challenges', label: 'Assigned Challenges', icon: Layers }
];

export const NodalSidebar = ({
  activeTab = 'overview',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  institutionName = 'Ranchi University'
}) => {
  return (
    <aside
      className={`bg-white border-r border-slate-200 px-3 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-1 px-1 border-b border-slate-100">
          {isSidebarExpanded && (
            <div className="min-w-0 pr-1">
              <div className="text-xs font-extrabold text-slate-900 truncate uppercase tracking-tight">
                {institutionName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Nodal HEI Node
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
            className={`p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors bg-white cursor-pointer shadow-2xs ${
              !isSidebarExpanded ? 'mx-auto' : ''
            }`}
            title={isSidebarExpanded ? 'Collapse' : 'Expand'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2 text-left' : 'p-2 justify-center'
                } ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isSidebarExpanded && <span className="truncate tracking-tight">{item.label}</span>}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2 space-x-2.5 text-left' : 'p-2 justify-center'
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-500" />
          {isSidebarExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default NodalSidebar;
