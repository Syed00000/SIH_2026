import React from 'react';
import { X, MapPin } from 'lucide-react';

export const InspectorModalHeader = ({
  challenge,
  district,
  assignedUni,
  activeSubTab,
  setActiveSubTab,
  onClose
}) => {
  return (
    <div className="p-4 border-b border-slate-100 space-y-2.5 bg-gradient-to-b from-emerald-50/40 to-white flex-shrink-0 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-extrabold text-[#007A61] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
            {challenge.id || challenge.challengeId}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              challenge.priority === 'High' || challenge.priority === 'Critical'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : challenge.priority === 'Low'
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-emerald-50 text-[#007A61] border border-emerald-200'
            }`}
          >
            {challenge.priority || 'Medium'} Priority
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {challenge.domain || 'Innovation'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h2 className="text-base font-black text-slate-900 leading-snug tracking-tight">
          {challenge.title}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mt-1">
          <span className="flex items-center space-x-1 text-slate-700 font-semibold">
            <MapPin className="w-3 h-3 text-[#007A61]" />
            <span>{district}, Jharkhand</span>
          </span>
          <span>&bull;</span>
          <span className="text-slate-500">Allocated to: <strong className="text-slate-800">{assignedUni}</strong></span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200/80 pt-1 text-xs gap-1.5">
        {[
          { id: 'overview', label: 'Ground Overview' },
          { id: 'location', label: 'Full Location & GPS' },
          { id: 'evidence', label: 'Citizen Testimony' },
          { id: 'similar', label: 'Milestones & Allocation' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-1.5 px-3 font-bold transition-all cursor-pointer border-b-2 rounded-t-lg ${
              activeSubTab === tab.id
                ? 'border-b-[#007A61] text-[#007A61] bg-emerald-50/60'
                : 'border-b-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InspectorModalHeader;
