import React from 'react';
import { Landmark, RefreshCw, Plus } from 'lucide-react';

export const DepartmentBanner = ({
  category = 'State Ministry',
  title,
  subtitle,
  isLoading,
  onRefresh,
  onAdd
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <span className="flex items-center space-x-1">
            <Landmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Governance Directory</span>
          </span>
          <span>•</span>
          <span className="text-slate-700">{category}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center space-x-2.5 flex-wrap">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
          title="Refresh Directory"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#007A61]' : ''}`} />
        </button>
        {category === 'State Ministry' && (
          <button
            type="button"
            onClick={onAdd}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-100" />
            <span>Add Department</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DepartmentBanner;
