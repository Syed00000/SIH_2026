import React from 'react';
import { Home, AlertCircle, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

export const WardSidebar = ({
  activeTab = 'overview',
  setActiveTab,
  assignedCount = 0,
  isSidebarExpanded = true,
  setIsSidebarExpanded
}) => {
  const items = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'problems', label: 'Assigned Problems', icon: AlertCircle, badge: assignedCount }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 px-2.5 pt-4 pb-3 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full select-none relative ${
        isSidebarExpanded ? 'w-52' : 'w-16'
      }`}
    >
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="hidden md:flex absolute -right-3 top-4 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer z-30"
        title={isSidebarExpanded ? 'Collapse' : 'Expand'}
      >
        {isSidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-4">
        <div className="px-1.5 pb-2 border-b border-slate-100">
          {isSidebarExpanded ? (
            <div>
              <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                WARD AUTHORITY
              </div>
              <div className="text-[9.5px] text-[#007A61] font-bold uppercase mt-0.5">
                MUNICIPAL CELL
              </div>
            </div>
          ) : (
            <div className="text-center font-black text-[#007A61] text-xs">WRD</div>
          )}
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSidebarExpanded ? 'px-3 py-2.5' : 'p-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-[#007A61] text-white shadow-2xs font-extrabold'
                    : 'text-slate-700 hover:bg-emerald-50/70 hover:text-[#007A61]'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isSidebarExpanded && <span className="truncate">{item.label}</span>}
                </div>
                {isSidebarExpanded && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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

      <div className="pt-3 border-t border-slate-100 text-center">
        {isSidebarExpanded && (
          <p className="text-[10px] text-slate-400 font-semibold">Government of Jharkhand</p>
        )}
      </div>
    </aside>
  );
};

export default WardSidebar;
