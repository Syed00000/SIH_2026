import React from 'react';
import { CheckCircle2, Clock, Users } from 'lucide-react';

export const FacultyRoadmapCard = ({ projects = [], onNavigateTab }) => {
  const hasDisbursedFunds = projects.some(
    (p) => p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0'
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
        Faculty Action Roadmap
      </h2>

      <div className="space-y-2.5 text-xs">
        {/* Step 1 */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-950 text-[11.5px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
            <span>1. Problem Allocated</span>
          </div>
          <p className="text-[10.5px] text-emerald-800 leading-relaxed pl-5">
            Assigned by Ranchi University node as Lead Research Mentor.
          </p>
        </div>

        {/* Step 2 */}
        {hasDisbursedFunds ? (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 transition-all text-emerald-900">
            <div className="flex items-center space-x-1.5 font-bold text-[11.5px] text-emerald-950">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
              <span>2. Draft Proposal & Budget</span>
            </div>
            <p className="text-[10.5px] leading-relaxed pl-5 text-emerald-800">
              Proposal successfully submitted and approved. Funds allocated.
            </p>
          </div>
        ) : (
          <div
            onClick={() => onNavigateTab('projects')}
            className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1 cursor-pointer hover:bg-amber-100/70 transition-all ring-1 ring-amber-300/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-bold text-amber-950 text-[11.5px]">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                <span>2. Draft Proposal & Budget</span>
              </div>
              <span className="text-[9px] font-extrabold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                Action Required
              </span>
            </div>
            <p className="text-[10.5px] text-amber-900 leading-relaxed pl-5">
              Formulate research plan, line-item hardware, and field trial budget breakdown.
            </p>
          </div>
        )}

        {/* Step 3 */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 cursor-pointer hover:bg-slate-100 transition-all"
        >
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11.5px]">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>3. Form Student Research Team</span>
          </div>
          <p className="text-[10.5px] text-slate-600 leading-relaxed pl-5">
            Recruit B.Tech/M.Tech student innovators for prototype engineering.
          </p>
        </div>

        {/* Step 4 */}
        <div className={`p-3 border rounded-xl space-y-1 transition-all ${
          hasDisbursedFunds
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-slate-50 border-slate-200 opacity-70'
        }`}>
          <div className={`flex items-center space-x-1.5 font-bold text-[11.5px] ${
            hasDisbursedFunds ? 'text-emerald-950' : 'text-slate-600'
          }`}>
            {hasDisbursedFunds ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[9px]">4</span>
            )}
            <span>4. Government Sanction & Grant</span>
          </div>
          <p className={`text-[10.5px] leading-relaxed pl-5 ${
            hasDisbursedFunds ? 'text-emerald-800' : 'text-slate-500'
          }`}>
            {hasDisbursedFunds
              ? 'Funds disbursed successfully. Ready for execution.'
              : 'University approves and forwards proposal to Govt for grant sanction.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyRoadmapCard;
