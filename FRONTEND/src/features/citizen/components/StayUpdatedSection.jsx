import React from 'react';
import { Megaphone, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';

const TILES = [
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Megaphone,
    iconColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-100/80'
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: MessageSquare,
    iconColor: 'text-teal-700',
    bgColor: 'bg-teal-50/70',
    borderColor: 'border-teal-100/80'
  },
  {
    id: 'guidelines',
    title: 'Guidelines',
    icon: BookOpen,
    iconColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-100/80'
  },
  {
    id: 'help',
    title: 'Help Center',
    icon: HelpCircle,
    iconColor: 'text-sky-700',
    bgColor: 'bg-sky-50/70',
    borderColor: 'border-sky-100/80'
  }
];

export const StayUpdatedSection = ({ onSelectTile }) => {
  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
        Stay Updated
      </h3>

      {/* 4 Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => onSelectTile && onSelectTile(tile.id)}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer group"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${tile.bgColor} ${tile.borderColor} border flex items-center justify-center transition-transform group-hover:scale-105`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${tile.iconColor}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center leading-tight mt-1.5 line-clamp-1">
                {tile.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default StayUpdatedSection;
