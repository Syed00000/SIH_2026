import React from 'react';
import { LayoutDashboard, Wrench, User } from 'lucide-react';

export const TechnicianMobileNav = ({ activeTab, setActiveTab, counts = { pending: 0 } }) => {
  const tabs = [
    { id: 'home', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Problems', icon: Wrench, badge: counts.pending > 0 ? counts.pending : null },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-1.5 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative ${
                isActive ? 'text-[#064e3b]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TechnicianMobileNav;
