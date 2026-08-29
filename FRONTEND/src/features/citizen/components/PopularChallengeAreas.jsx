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
  { id: 'Education', name: 'Education', Icon: GraduationCap, iconColor: 'text-blue-600' },
  { id: 'Healthcare', name: 'Healthcare', Icon: HeartPulse, iconColor: 'text-rose-600' },
  { id: 'Agriculture', name: 'Agriculture', Icon: Sprout, iconColor: 'text-emerald-600' },
  { id: 'Water Resources', name: 'Water Resources', Icon: Droplet, iconColor: 'text-sky-600' },
  { id: 'Environment', name: 'Environment', Icon: Recycle, iconColor: 'text-teal-600' },
  { id: 'Energy', name: 'Energy', Icon: Zap, iconColor: 'text-amber-600' },
  { id: 'Urban Development', name: 'Urban Development', Icon: Building2, iconColor: 'text-indigo-600' },
  { id: 'Accessibility', name: 'Accessibility', Icon: Accessibility, iconColor: 'text-cyan-600' },
  { id: 'Public Administration', name: 'Public Administration', Icon: Landmark, iconColor: 'text-violet-600' },
  { id: 'Rural Livelihoods', name: 'Rural Livelihoods', Icon: Handshake, iconColor: 'text-blue-700' }
];

export const PopularChallengeAreas = ({ onSelectArea, selectedArea }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedAreas = showAll ? AREAS : AREAS.slice(0, 10);

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
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

      {/* Grid of 5 columns on desktop with distinct vibrant icon colors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {displayedAreas.map((area) => {
          const isSelected = selectedArea === area.id;
          const { Icon } = area;

          return (
            <button
              key={area.id}
              onClick={() => onSelectArea && onSelectArea(area.id)}
              className={`group flex flex-col items-center justify-center p-3.5 rounded-lg transition-all duration-150 cursor-pointer bg-white border ${
                isSelected
                  ? 'border-emerald-600 ring-1 ring-emerald-500 shadow-2xs'
                  : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              {/* Icon with multiple distinct colors */}
              <Icon className={`w-5 h-5 ${area.iconColor} transition-transform group-hover:scale-110`} />

              {/* Title */}
              <span className="text-xs font-bold text-slate-800 text-center leading-tight mt-2 line-clamp-1 group-hover:text-emerald-900">
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
