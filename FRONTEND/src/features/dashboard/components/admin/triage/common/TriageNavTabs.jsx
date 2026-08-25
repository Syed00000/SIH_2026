import React from 'react';
import { Cpu, Sliders, Layers, AlertTriangle } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';

export const TriageNavTabs = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'classification',
      title: 'Domain Auto-Classification',
      subtitle: 'Review AI classified issues',
      icon: Cpu
    },
    {
      id: 'override',
      title: 'Manual Override',
      subtitle: 'Reclassify if needed',
      icon: Sliders
    },
    {
      id: 'deduplication',
      title: 'Deduplication Matrix',
      subtitle: 'Review & merge duplicates',
      icon: Layers
    },
    {
      id: 'escalation',
      title: 'Priority Escalation',
      subtitle: 'Mark critical / urgent issues',
      icon: AlertTriangle
    }
  ];

  return (
    <Card className="p-2 bg-white border-slate-200 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tabs.map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2.5 p-2.5 rounded-md transition-all text-left cursor-pointer border ${
                isActive
                  ? 'border-blue-500 bg-blue-50/70 shadow-2xs'
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <IconC className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span
                  className={`text-xs font-bold block leading-tight truncate ${
                    isActive ? 'text-blue-900' : 'text-slate-800'
                  }`}
                >
                  {tab.title}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight truncate mt-0.5">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default TriageNavTabs;
