import React, { useState } from 'react';
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Droplet,
  Recycle,
  Zap,
  Building2,
  Accessibility,
  Landmark,
  Handshake,
  ChevronRight
} from 'lucide-react';

const AREAS = [
  {
    id: 'Education',
    name: 'Education',
    Icon: GraduationCap,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100'
  },
  {
    id: 'Healthcare',
    name: 'Healthcare',
    Icon: HeartPulse,
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-100'
  },
  {
    id: 'Agriculture',
    name: 'Agriculture',
    Icon: Sprout,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100'
  },
  {
    id: 'Water Resources',
    name: 'Water Resources',
    Icon: Droplet,
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-100'
  },
  {
    id: 'Environment',
    name: 'Environment',
    Icon: Recycle,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-100'
  },
  {
    id: 'Energy',
    name: 'Energy',
    Icon: Zap,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100'
  },
  {
    id: 'Urban Development',
    name: 'Urban Development',
    Icon: Building2,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-100'
  },
  {
    id: 'Accessibility',
    name: 'Accessibility',
    Icon: Accessibility,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    borderColor: 'border-cyan-100'
  },
  {
    id: 'Public Administration',
    name: 'Public Administration',
    Icon: Landmark,
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-700',
    borderColor: 'border-slate-200'
  },
  {
    id: 'Rural Livelihoods',
    name: 'Rural Livelihoods',
    Icon: Handshake,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-700',
    borderColor: 'border-blue-100'
  }
];

export const PopularChallengeAreas = ({ onSelectArea, selectedArea }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedAreas = showAll ? AREAS : AREAS.slice(0, 10);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
          Popular Challenge Areas
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <span>{showAll ? 'Show Less' : 'View All'}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Grid of 5 columns on mobile / 5 on desktop matching mockup */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {displayedAreas.map((area) => {
          const isSelected = selectedArea === area.id;
          const { Icon } = area;

          return (
            <button
              key={area.id}
              onClick={() => onSelectArea && onSelectArea(area.id)}
              className={`group flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all duration-150 cursor-pointer bg-white border ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${area.bgColor} ${area.borderColor} border flex items-center justify-center transition-transform group-hover:scale-105`}
              >
                <Icon className={`w-5 h-5 ${area.iconColor}`} />
              </div>

              {/* Title */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 text-center leading-tight mt-1.5 line-clamp-2">
                {area.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PopularChallengeAreas;
