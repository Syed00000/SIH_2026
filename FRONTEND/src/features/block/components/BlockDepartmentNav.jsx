import React from 'react';
import { Droplet, Compass, Zap, Trash2, HeartPulse, Layers } from 'lucide-react';

export const DEPARTMENTS = [
  { id: 'ALL', label: 'All Departments', icon: Layers },
  { id: 'WATER', label: 'Drinking Water & Sanitation', key: 'Water', icon: Droplet },
  { id: 'ROADS', label: 'Roads & Rural Works', key: 'Road', icon: Compass },
  { id: 'POWER', label: 'Electricity & Power', key: 'Electric', icon: Zap },
  { id: 'WASTE', label: 'Sanitation & Solid Waste', key: 'Sanitation', icon: Trash2 },
  { id: 'HEALTH', label: 'Public Health & Anganwadi', key: 'Health', icon: HeartPulse }
];

export const BlockDepartmentNav = ({ activeDept, onSelectDept, challenges = [] }) => {
  const getDeptCount = (deptKey) => {
    if (deptKey === 'ALL') return challenges.length;
    const q = deptKey.toLowerCase();
    return challenges.filter((c) => {
      const aName = (c.assignedDepartment?.name || '').toLowerCase();
      const domain = (c.domain || '').toLowerCase();
      const title = (c.title || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      return aName.includes(q) || domain.includes(q) || title.includes(q) || desc.includes(q);
    }).length;
  };

  return (
    <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap gap-1.5 select-none">
      {DEPARTMENTS.map((dept) => {
        const Icon = dept.icon;
        const isSelected = activeDept === dept.id;
        const count = getDeptCount(dept.id === 'ALL' ? 'ALL' : dept.key);

        return (
          <button
            key={dept.id}
            type="button"
            onClick={() => onSelectDept(dept.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#007A61] text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{dept.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BlockDepartmentNav;
