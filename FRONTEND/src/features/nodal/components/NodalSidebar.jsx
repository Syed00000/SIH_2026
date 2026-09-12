import React from 'react';
import {
  Home,
  Layers,
  GraduationCap,
  Landmark,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Building2,
  Briefcase
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Triage Overview', icon: Home },
  { id: 'universities', label: 'HEI Directory', icon: GraduationCap },
  { id: 'challenges', label: 'Citizen Challenges', icon: Layers },
  { id: 'state-directory', label: 'State Department', icon: Landmark },
  { id: 'district-directory', label: 'District Department', icon: Briefcase },
  { id: 'block-directory', label: 'Block Department', icon: Building },
  { id: 'ward-directory', label: 'Ward Department', icon: Building2 },
  { id: 'profile', label: 'Profile', icon: User }
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
      className={`bg-white border-r border-slate-200 px-2.5 pt-3 pb-3.5 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-2xs select-none relative ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-52 shadow-2xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-52' : 'w-16'}`}
    >
      <button
        onClick={() => {
          if (isMobileMenuOpen && setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
          } else if (setIsSidebarExpanded) {
            setIsSidebarExpanded(!isSidebarExpanded);
          }
        }}
        className="hidden md:flex absolute -right-3 top-3.5 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer z-30"
        title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar">
        <div className="flex items-center justify-between pb-2.5 px-1 border-b border-slate-100">
          {isSidebarExpanded ? (
            <div className="min-w-0 pr-1.5">
              <div className="text-[11.5px] font-extrabold text-slate-900 truncate uppercase tracking-tight">
                {institutionName}
              </div>
              <div className="text-[9.5px] text-[#047857] font-bold uppercase tracking-wider mt-0.5">
                NODAL AUTHORITY
              </div>
            </div>
          ) : (
            <div className="mx-auto text-[10px] font-extrabold text-[#047857] uppercase tracking-wider text-center py-1">
              NODAL
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'challenges' && activeTab === 'assigned') ||
              (item.id === 'block-directory' && activeTab === 'local-bodies');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center rounded-md text-xs font-bold transition-all relative cursor-pointer ${
                  isSidebarExpanded ? 'px-2.5 py-2 text-left space-x-2.5' : 'p-2 justify-center'
                } ${
                  isActive
                    ? 'bg-[#047857] text-white shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#064e3b]'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {isSidebarExpanded && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2 border-t border-slate-100 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-md text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ${
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
