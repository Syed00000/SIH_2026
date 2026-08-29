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
  const displayedAreas = showAll ? AREAS : AREAS.slice(0, 8);

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
          Popular Challenge Areas
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center text-[11px] font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <span>{showAll ? 'Show Less' : 'View All'}</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Grid of 4 columns matching mobile screenshot (Image 1) */}
      <div className="grid grid-cols-4 gap-2">
        {displayedAreas.map((area) => {
          const isSelected = selectedArea === area.id;
          const { Icon } = area;

          return (
            <button
              key={area.id}
              onClick={() => onSelectArea && onSelectArea(area.id)}
              className={`group flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150 cursor-pointer bg-white border ${
                isSelected
                  ? 'border-emerald-600 ring-1 ring-emerald-500 shadow-2xs'
                  : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-2xs'
              }`}
            >
              {/* Vibrant Multiple Color Icons */}
              <Icon className={`w-5 h-5 ${area.iconColor} transition-transform group-hover:scale-110`} />

              {/* Title */}
              <span className="text-[10px] font-extrabold text-slate-800 text-center leading-tight mt-1.5 line-clamp-2">
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
