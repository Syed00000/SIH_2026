import React from 'react';
import { Droplet, Wrench, Trash2, ChevronRight } from 'lucide-react';

const communityItems = [
  {
    id: 1,
    title: 'Water scarcity in rural areas',
    meta: 'Dumka • Water Management | 34 citizens',
    icon: Droplet,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    id: 2,
    title: 'Poor road connectivity to health centre',
    meta: 'Gumla • Infrastructure | 28 citizens',
    icon: Wrench,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50'
  },
  {
    id: 3,
    title: 'Irregular waste collection',
    meta: 'Ranchi • Sanitation | 19 citizens',
    icon: Trash2,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50'
  }
];

export const CommunityChallengesCard = ({ onExploreCommunity }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <h3 className="font-bold text-slate-900 text-xs md:text-sm">Community Challenges</h3>
        <button
          onClick={onExploreCommunity}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex-1 divide-y divide-slate-100 text-xs">
        {communityItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 px-1 rounded transition-colors group"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className={`w-7 h-7 rounded ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 text-xs truncate">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {item.meta}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-all flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityChallengesCard;
