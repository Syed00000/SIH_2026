import React from 'react';
import { Cpu, Sliders, Layers, AlertTriangle, ChevronRight } from 'lucide-react';

export const TriageNavTabs = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'classification',
      title: 'Domain Classification',
      description: 'Automatic sector categorization & routing',
      icon: Cpu,
      activeBg: 'border-[#007A61] bg-[#007A61]/10 ring-1 ring-[#007A61]/30 text-[#005a47]',
      activeIcon: 'bg-[#007A61] text-white',
      inactiveIcon: 'bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20',
      tag: 'Auto-AI'
    },
    {
      id: 'override',
      title: 'Department Override',
      description: 'Manual reassignment & sector updates',
      icon: Sliders,
      activeBg: 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30 text-amber-950',
      activeIcon: 'bg-amber-600 text-white',
      inactiveIcon: 'bg-amber-50 text-amber-600 border border-amber-100',
      tag: 'Manual'
    },
    {
      id: 'deduplication',
      title: 'Duplicate Review',
      description: 'Identify & merge identical problem reports',
      icon: Layers,
      activeBg: 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/30 text-emerald-950',
      activeIcon: 'bg-emerald-600 text-white',
      inactiveIcon: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      tag: 'Clusters'
    },
    {
      id: 'escalation',
      title: 'Priority Escalation',
      description: 'High-severity issues & fast-track dispatch',
      icon: AlertTriangle,
      activeBg: 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500/30 text-rose-950',
      activeIcon: 'bg-rose-600 text-white',
      inactiveIcon: 'bg-rose-50 text-rose-600 border border-rose-100',
      tag: 'Critical'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`group relative text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between h-[84px] select-none ${
              isActive
                ? `${tab.activeBg} shadow-xs`
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
            }`}
          >
            {/* Top row: Icon + Title + Tag */}
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center space-x-2 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                <span className="font-bold text-xs tracking-tight text-slate-900 truncate">
                  {tab.title}
                </span>
              </div>

              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md shrink-0 border ${
                  isActive
                    ? 'bg-white/90 border-slate-300/80 text-slate-800'
                    : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {tab.tag}
              </span>
            </div>

            {/* Bottom row: Description */}
            <p className="text-[10.5px] font-medium text-slate-500 truncate w-full pl-0.5">
              {tab.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default TriageNavTabs;
