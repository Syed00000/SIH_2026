import React from 'react';
import { FlaskConical, HandCoins, Briefcase, Sparkles, Building2 } from 'lucide-react';

export const PartnershipModalFormFields = ({
  outcome,
  onChangeOutcome,
  budget,
  onChangeBudget,
  duration,
  onChangeDuration,
  funding,
  onChangeFunding,
  labAccess,
  onChangeLabAccess,
  techMentorship,
  onChangeTechMentorship,
  isResearchLab = false
}) => {
  return (
    <div className="space-y-4">
      {/* Execution Outcome & Technical Deliverable */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Execution Outcome & Lab Deliverable *
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
          placeholder={isResearchLab 
            ? "Specify lab testing requirements, required R&D equipment, sample analysis protocols, and milestone targets..." 
            : "Describe the prototype deliverable, expected CSR impact, and collaboration timeline..."}
          className="w-full text-xs font-medium text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
        />
      </div>

      {/* Budget & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Estimated CSR / Lab Grant (₹)
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => onChangeBudget(e.target.value)}
            placeholder="e.g. ₹ 5,00,000"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
          />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Collaboration Duration
          </label>
          <select
            value={duration}
            onChange={(e) => onChangeDuration(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
          >
            <option>1 Month</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>1 Year</option>
            <option>Permanent MoU</option>
          </select>
        </div>
      </div>

      {/* Support Modalities */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Support Modalities Required *
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Select all that apply</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className={`flex items-center p-2.5 rounded-xl cursor-pointer border transition-colors ${labAccess ? 'bg-blue-50/80 border-blue-300' : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/40'}`}>
            <input 
              type="checkbox" 
              checked={labAccess} 
              onChange={(e) => onChangeLabAccess(e.target.checked)} 
              className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" 
            />
            <div className="ml-2">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                <span>Lab Access</span>
              </span>
            </div>
          </label>

          <label className={`flex items-center p-2.5 rounded-xl cursor-pointer border transition-colors ${funding ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/40'}`}>
            <input 
              type="checkbox" 
              checked={funding} 
              onChange={(e) => onChangeFunding(e.target.checked)} 
              className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" 
            />
            <div className="ml-2">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <HandCoins className="w-3.5 h-3.5 text-[#007A61]" />
                <span>CSR Grant</span>
              </span>
            </div>
          </label>

          <label className={`flex items-center p-2.5 rounded-xl cursor-pointer border transition-colors ${techMentorship ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/40'}`}>
            <input 
              type="checkbox" 
              checked={techMentorship} 
              onChange={(e) => onChangeTechMentorship(e.target.checked)} 
              className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" 
            />
            <div className="ml-2">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Mentorship</span>
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PartnershipModalFormFields;
