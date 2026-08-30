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
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: GraduationCap,
    bgColor: 'bg-blue-50'
  },
  {
    id: 'Healthcare',
    name: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: HeartPulse,
    bgColor: 'bg-rose-50'
  },
  {
    id: 'Agriculture',
    name: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Sprout,
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'Water Resources',
    name: 'Water Resources',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Droplet,
    bgColor: 'bg-sky-50'
  },
  {
    id: 'Environment',
    name: 'Environment',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Recycle,
    bgColor: 'bg-teal-50'
  },
  {
    id: 'Energy',
    name: 'Energy',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Zap,
    bgColor: 'bg-amber-50'
  },
  {
    id: 'Urban Development',
    name: 'Urban Development',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Building2,
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'Accessibility',
    name: 'Accessibility',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Accessibility,
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'Public Administration',
    name: 'Public Administration',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Landmark,
    bgColor: 'bg-slate-50'
  },
  {
    id: 'Rural Livelihoods',
    name: 'Rural Livelihoods',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=300&q=80',
    fallbackIcon: Handshake,
    bgColor: 'bg-blue-50'
  }
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
          type="button"
          onClick={() => {
            setShowAll(!showAll);
            if (onSelectArea) onSelectArea(null);
          }}
          className="flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <span>{showAll ? 'Show Less' : 'View All'}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Clean 5-column grid without outer box */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {displayedAreas.map((area) => {
          const isSelected = selectedArea === area.id;
          const FallbackIcon = area.fallbackIcon;

          return (
            <button
              key={area.id}
              type="button"
              onClick={() => onSelectArea && onSelectArea(area.id)}
              className="group flex flex-col items-center justify-start p-1 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
            >
              {/* Image Container Tile */}
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-xs relative flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 ring-offset-2 scale-105 shadow-md'
                    : 'border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <img
                  src={area.image}
                  alt={area.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallbackEl = e.currentTarget.nextElementSibling;
                    if (fallbackEl) fallbackEl.style.display = 'flex';
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className={`w-full h-full items-center justify-center ${area.bgColor}`}
                >
                  <FallbackIcon className="w-5 h-5 text-slate-600" />
                </div>
              </div>

              {/* Title */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold text-center leading-tight mt-1.5 line-clamp-2 ${
                  isSelected ? 'text-emerald-700 font-bold' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
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
