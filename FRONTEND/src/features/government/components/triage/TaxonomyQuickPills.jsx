import React from 'react';
import { Droplet, Wrench, Sprout, HeartPulse, Trash2, BookOpen } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';

export const TaxonomyQuickPills = ({ onSelectCategory }) => {
  const sectors = [
    { id: 'water', name: 'Water & Sanitation', dept: 'DWSD', icon: Droplet, count: 18, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'infra', name: 'Public Infrastructure', dept: 'RCD / RDD', icon: Wrench, count: 14, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'agri', name: 'Agriculture & Irrigation', dept: 'Agriculture Dept', icon: Sprout, count: 11, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'health', name: 'Health & Nutrition', dept: 'H&FW Dept', icon: HeartPulse, count: 9, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'waste', name: 'Waste Management', dept: 'UD&HD', icon: Trash2, count: 6, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'edu', name: 'Education & Anganwadi', dept: 'SE&L Dept', icon: BookOpen, count: 5, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {sectors.map((sec) => {
        const Icon = sec.icon;
        return (
          <Card
            key={sec.id}
            onClick={() => onSelectCategory(sec.name)}
            className="p-2.5 bg-white border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-1.5 rounded border ${sec.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <Badge variant="default" className="text-[10px] font-bold">
                {sec.count}
              </Badge>
            </div>
            <h4 className="font-bold text-slate-800 text-xs mt-2 group-hover:text-blue-600 truncate">
              {sec.name}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium block truncate">
              {sec.dept}
            </span>
          </Card>
        );
      })}
    </div>
  );
};

export default TaxonomyQuickPills;
