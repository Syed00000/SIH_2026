import React from 'react';
import { X, Mail, Phone } from 'lucide-react';

export const DrawerHeaderTabs = ({
  faculty,
  initials,
  facultyProjects,
  activeTab,
  setActiveTab,
  onClose
}) => {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2.5 text-left">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            {initials}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-slate-900 leading-snug">{faculty.name}</h2>
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                {faculty.status || 'Active'}
              </span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${
                  faculty.isDeployed
                    ? 'bg-teal-50 text-teal-800 border-teal-300 font-extrabold'
                    : faculty.availabilityStatus === 'In Project'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : faculty.availabilityStatus === 'On Leave'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {faculty.isDeployed ? '🔒 Deployed' : faculty.availabilityStatus || 'Available'}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">{faculty.designation || 'Professor'}</div>
            <div className="text-[10.5px] text-slate-500">{faculty.department}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-md transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-slate-600 font-mono pt-1 border-t border-slate-200">
        <span className="flex items-center space-x-1"><Mail className="w-3 h-3 text-slate-400" /><span>{faculty.email}</span></span>
        <span className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-400" /><span>{faculty.phone || '+91 98765 43210'}</span></span>
      </div>

      <div className="flex border-b border-slate-200 pt-1 text-xs">
        {['overview', 'expertise', 'projects', 'availability'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1.5 px-2 font-bold capitalize transition-colors cursor-pointer border-b-2 ${
              activeTab === tab ? 'border-b-slate-900 text-slate-900' : 'border-b-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab === 'expertise' ? 'Expertise & Skills' : tab === 'projects' ? `Projects (${facultyProjects.length})` : tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrawerHeaderTabs;
