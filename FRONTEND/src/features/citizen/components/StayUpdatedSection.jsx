import React from 'react';
import { Megaphone, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';

const TILES = [
  { id: 'notifications', title: 'Notifications', icon: Megaphone, iconColor: 'text-emerald-600' },
  { id: 'messages', title: 'Messages', icon: MessageSquare, iconColor: 'text-teal-600' },
  { id: 'guidelines', title: 'Guidelines', icon: BookOpen, iconColor: 'text-indigo-600' },
  { id: 'help', title: 'Help Center', icon: HelpCircle, iconColor: 'text-sky-600' }
];

export const StayUpdatedSection = ({ onSelectTile }) => {
  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
        Stay Updated
      </h3>

      {/* 4 Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => onSelectTile && onSelectTile(tile.id)}
              className="flex items-center space-x-3 p-3.5 rounded-lg bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-xs transition-all duration-150 cursor-pointer group"
            >
              <Icon className={`w-4.5 h-4.5 ${tile.iconColor} transition-transform group-hover:scale-110 shrink-0`} />
              <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-emerald-900">
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
