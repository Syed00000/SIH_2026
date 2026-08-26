import React from 'react';
import { Cpu, Sliders, Layers, AlertTriangle } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';

export const TriageNavTabs = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'classification',
      title: 'Domain Classification',
      description: 'Automatic sector categorization & department routing',
      icon: Cpu,
      accentColor: 'border-blue-500 text-blue-600 bg-blue-50/60'
    },
    {
      id: 'override',
      title: 'Department Override',
      description: 'Manual reassignment, sector updates & audit tracking',
      icon: Sliders,
      accentColor: 'border-amber-500 text-amber-600 bg-amber-50/60'
    },
    {
      id: 'deduplication',
      title: 'Duplicate Review',
      description: 'Identify and merge identical citizen problem reports',
      icon: Layers,
      accentColor: 'border-emerald-500 text-emerald-600 bg-emerald-50/60'
    },
    {
      id: 'escalation',
      title: 'Priority Escalation',
      description: 'High-severity issues & fast-track department dispatch',
      icon: AlertTriangle,
      accentColor: 'border-rose-500 text-rose-600 bg-rose-50/60'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Card
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`cursor-pointer transition-all duration-150 p-2.5 rounded-md border text-left flex flex-col justify-between ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`p-1 rounded ${
                  isActive ? 'bg-slate-800 text-white' : tab.accentColor
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs tracking-tight truncate">
                {tab.title}
              </span>
            </div>
            <p
              className={`text-[10.5px] mt-1 line-clamp-1 ${
                isActive ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {tab.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
};

export default TriageNavTabs;
