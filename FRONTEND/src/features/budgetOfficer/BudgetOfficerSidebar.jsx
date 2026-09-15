import React from 'react';
import { Home, Layers, ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';

export const BudgetOfficerSidebar = ({
  activeTab = 'home',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout,
  counts
}) => {
  const NAV_ITEMS = [
    { id: 'home', label: 'Overview', icon: Home },
    { 
      id: 'tasks', 
      label: 'Assigned Budgets', 
      icon: Layers,
      badge: counts?.pending > 0 ? counts.pending : null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-30 md:hidden"
        />
      )}

      <aside
        className={`bg-white border-r border-slate-200 px-2.5 pt-3 pb-3.5 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-2xs select-none ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl bg-white z-40'
            : 'hidden md:flex'
        } ${isSidebarExpanded ? 'md:w-52' : 'md:w-16'}`}
      >
        {/* Collapse Toggle Button (Desktop) */}
        <button
          type="button"
          onClick={() => setIsSidebarExpanded && setIsSidebarExpanded(!isSidebarExpanded)}
          className="hidden md:flex absolute -right-3 top-3.5 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer z-30"
          title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        <div className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar text-left">
          {/* Top Mini Header with Mobile Close button */}
          <div className="flex items-center justify-between pb-2.5 px-1 border-b border-slate-100">
            {isSidebarExpanded || isMobileMenuOpen ? (
              <div className="min-w-0 pr-1.5">
                <div className="text-[11.5px] font-extrabold text-slate-900 truncate uppercase tracking-tight">
                  BUDGET PORTAL
                </div>
                <div className="text-[9.5px] text-[#007A61] font-bold uppercase tracking-wider mt-0.5">
                  DEPT OF FINANCE
                </div>
              </div>
            ) : (
              <div className="mx-auto text-[10px] font-extrabold text-[#007A61] uppercase tracking-wider text-center py-1">
                BO
              </div>
            )}

            {isMobileMenuOpen && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                className="md:hidden p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
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
                  className={`w-full flex items-center justify-between rounded-md text-xs font-bold transition-all relative cursor-pointer ${
                    isSidebarExpanded || isMobileMenuOpen ? 'px-2.5 py-2 text-left' : 'p-2 justify-center'
                  } ${
                    isActive
                      ? 'bg-[#007A61] text-white shadow-2xs font-extrabold'
                      : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#064e3b]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {(isSidebarExpanded || isMobileMenuOpen) && <span className="truncate">{item.label}</span>}
                  </div>
                  {(isSidebarExpanded || isMobileMenuOpen) && item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] rounded-full shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#007A61]/10 text-[#007A61]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Action - ONLY Sign Out */}
        {onLogout && (
          <div className="pt-2 border-t border-slate-100 text-left">
            <button
              type="button"
              onClick={onLogout}
              className={`w-full flex items-center rounded-md text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ${
                isSidebarExpanded || isMobileMenuOpen ? 'px-2.5 py-2 space-x-2.5' : 'p-2 justify-center'
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
              {(isSidebarExpanded || isMobileMenuOpen) && <span className="truncate">Sign Out</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default BudgetOfficerSidebar;
