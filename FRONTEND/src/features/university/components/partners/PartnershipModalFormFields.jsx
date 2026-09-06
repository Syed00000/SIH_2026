import React from 'react';
import { FlaskConical, Clock, Target } from 'lucide-react';

export const PartnershipModalFormFields = ({
  outcome,
  onChangeOutcome,
  duration = '3 Months',
  onChangeDuration,
  purpose = 'Prototype Testing',
  onChangePurpose,
  isResearchLab = false
}) => {
  return (
    <div className="space-y-4 text-left">
      {/* 1. Execution Outcome & Lab Deliverable */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Execution Outcome &amp; Lab Deliverable *
          </label>
          {isResearchLab && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center space-x-1">
              <FlaskConical className="w-3 h-3 text-blue-600" />
              <span>Research Lab Facility Access</span>
            </span>
          )}
        </div>
        <textarea
          rows={3}
          value={outcome}
          onChange={(e) => onChangeOutcome(e.target.value)}
          placeholder={
            isResearchLab
              ? 'Specify lab testing requirements, required R&D equipment, sample analysis protocols, and milestone targets...'
              : 'Describe the prototype deliverable, expected CSR impact, and collaboration timeline...'
          }
          className="w-full text-xs font-medium text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
        />
      </div>

      {/* 2. Collaboration Duration & Purpose */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#007A61]" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Collaboration Duration &amp; Purpose *
            </h4>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Testing fee quoted by industry upon acceptance
          </span>
        </div>

        {/* Duration & Purpose Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Collaboration Duration *
            </label>
            <select
              value={duration}
              onChange={(e) => onChangeDuration(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] shadow-2xs cursor-pointer"
            >
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="Permanent MoU">Permanent MoU</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <Target className="w-3 h-3 text-[#007A61]" />
              <span>Collaboration Purpose *</span>
            </label>
            <select
              value={purpose}
              onChange={(e) => onChangePurpose?.(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] shadow-2xs cursor-pointer"
            >
              <option value="Prototype Testing">Prototype Testing</option>
              <option value="Mentorship">Mentorship</option>
            </select>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-500 italic pt-0.5">
          * Note: Laboratory testing charges and facility access fees will be reviewed and quoted by the industry partner upon proposal acceptance.
        </p>
      </div>
    </div>
  );
};

export default PartnershipModalFormFields;
