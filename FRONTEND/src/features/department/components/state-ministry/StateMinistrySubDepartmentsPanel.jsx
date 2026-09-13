import React, { useState } from 'react';
import { Building2, Search, Plus, MapPin, MoreVertical, Layers } from 'lucide-react';

export const StateMinistrySubDepartmentsPanel = ({ department }) => {
  const [activeLevel, setActiveLevel] = useState('District Department');
  
  const hierarchyLevels = (department?.hierarchyConfig || []).filter(h => h !== 'State Department');

  if (hierarchyLevels.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">No Sub-Departments Configured</h3>
        <p className="text-xs text-slate-500 mt-1">Please configure the administrative hierarchy first to add sub-departments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#007A61]" />
            Sub-Department Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the administrative tree for {department?.name}.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add New Unit</span>
        </button>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {hierarchyLevels.map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                activeLevel === level 
                  ? 'border-[#007A61] text-[#007A61] bg-emerald-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {level}s
            </button>
          ))}
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeLevel}...`}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007A61] focus:border-[#007A61] outline-none transition-all"
              />
            </div>
          </div>

          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-slate-700">No {activeLevel}s Registered</h3>
            <p className="text-[11px] text-slate-500 mt-1">Register the first unit to start building your hierarchy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
