import React from 'react';
import { Home, Layers, Wrench, Building2 } from 'lucide-react';

export const DepartmentMobileNav = ({
  activeTab = 'overview',
  onSelectTab,
  problemCount = 0,
  techCount = 0,
  districtCount = 0
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'problems', label: 'Problems', icon: Layers, badge: problemCount > 0 ? problemCount : null },
    { id: 'technicians', label: 'Technicians', icon: Wrench, badge: techCount > 0 ? techCount : null },
    { id: 'districts', label: 'Districts', icon: Building2, badge: districtCount > 0 ? districtCount : null }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-1 relative ${
                isActive ? 'text-[#007A61]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-[#007A61] text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default DepartmentMobileNav;
