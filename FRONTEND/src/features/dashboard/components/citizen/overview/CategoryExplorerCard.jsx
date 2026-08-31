import React from 'react';
import {
  Sprout,
  Droplet,
  HeartPulse,
  BookOpen,
  Trash2,
  Leaf,
  Wrench,
  Home,
  Accessibility,
  Briefcase
} from 'lucide-react';

const categories = [
  { name: 'Agriculture', icon: Sprout, bg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' },
  { name: 'Water', icon: Droplet, bg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
  { name: 'Healthcare', icon: HeartPulse, bg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' },
  { name: 'Education', icon: BookOpen, bg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' },
  { name: 'Sanitation', icon: Trash2, bg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100' },
  { name: 'Environment', icon: Leaf, bg: 'bg-lime-50 text-lime-600 group-hover:bg-lime-100' },
  { name: 'Infrastructure', icon: Wrench, bg: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' },
  { name: 'Livelihood', icon: Home, bg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' },
  { name: 'Accessibility', icon: Accessibility, bg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100' },
  { name: 'Services', icon: Briefcase, bg: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100' }
];

export const CategoryExplorerCard = ({ onCategoryClick }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
        <h3 className="font-bold text-slate-900 text-xs md:text-sm">Explore by Category</h3>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
          View All
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          return (
            <div
              key={cat.name}
              onClick={() => onCategoryClick && onCategoryClick(cat.name)}
              className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded ${cat.bg} flex items-center justify-center`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryExplorerCard;
