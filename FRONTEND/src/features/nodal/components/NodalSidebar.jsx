import React from 'react';
import {
  Home,
  Layers,
  GraduationCap,
  Landmark,
  LogOut,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Triage Overview', icon: Home },
  { id: 'universities', label: 'HEI Directory', icon: Landmark },
  { id: 'challenges', label: 'Citizen Challenges', icon: Layers }
];

export const NodalSidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  institutionName = 'State Innovation Cell'
}) => {
  return (
    <aside
      className={`bg-white border-r border-slate-200/90 px-2.5 pt-3 pb-3.5 flex flex-col justify-between flex-shrink-0 transition-all duration-150 h-full z-20 shadow-2xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-52 shadow-2xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-52' : 'w-14'}`}
    >
      <div className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2.5 px-1 border-b border-slate-100">
          {isSidebarExpanded && (
            <div className="min-w-0 pr-1.5">
              <div className="text-[11.5px] font-extrabold text-slate-900 truncate uppercase tracking-tight">
                {institutionName}
              </div>
              <div className="text-[9.5px] text-[#047857] font-extrabold uppercase tracking-wider mt-0.5 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" />
                <span>Nodal Authority</span>
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
            className={`p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors bg-white cursor-pointer shadow-2xs ${
              !isSidebarExpanded ? 'mx-auto' : ''
            }`}
            title={isSidebarExpanded ? 'Collapse' : 'Expand'}
          >
            {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'challenges' && activeTab === 'assigned');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-2.5 py-2 text-left' : 'p-2 justify-center'
                } ${
                  isActive
                    ? 'bg-[#047857] text-white shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#064e3b]'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isSidebarExpanded && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Item */}
      <div className="pt-2 border-t border-slate-100 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ${
            isSidebarExpanded ? 'px-2.5 py-2 space-x-2.5 text-left' : 'p-2 justify-center'
          }`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          {isSidebarExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default NodalSidebar;
