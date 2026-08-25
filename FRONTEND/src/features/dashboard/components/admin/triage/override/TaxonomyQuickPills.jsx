import React from 'react';
import { Droplet, Wrench, Sprout, HeartPulse, Trash2, BookOpen } from 'lucide-react';
import { Card } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';

export const TaxonomyQuickPills = ({ onSelectCategory }) => {
  const sectors = [
    { name: 'Water Resources', icon: Droplet, count: 18, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { name: 'Public Infrastructure', icon: Wrench, count: 24, color: 'text-amber-800 bg-amber-50 border-amber-200' },
    { name: 'Agriculture & Farming', icon: Sprout, count: 12, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Public Health', icon: HeartPulse, count: 15, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { name: 'Sanitation & Waste', icon: Trash2, count: 9, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { name: 'Education & Skills', icon: BookOpen, count: 6, color: 'text-purple-700 bg-purple-50 border-purple-200' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {sectors.map((sec, i) => {
        const IconC = sec.icon;
        return (
          <Card
            key={i}
            onClick={() => onSelectCategory && onSelectCategory(sec.name)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-md border text-center transition-all hover:shadow-xs cursor-pointer ${sec.color}`}
          >
            <IconC className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-bold block leading-tight">{sec.name}</span>
            <Badge variant="default" className="text-[9px] font-semibold mt-1 py-0 px-1 border-transparent">
              {sec.count} overrides
            </Badge>
          </Card>
        );
      })}
    </div>
  );
};

export default TaxonomyQuickPills;
