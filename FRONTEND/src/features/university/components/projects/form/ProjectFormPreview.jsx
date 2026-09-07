import React from 'react';
import { Sparkles, ShieldCheck, Info } from 'lucide-react';

export const ProjectFormPreview = ({ formData, totalBudget }) => {
  return (
    <div className="space-y-4">
      {/* Live Preview */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            Live Project Preview
          </span>
          <span className="inline-flex items-center space-x-1 text-[10px] text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            <Sparkles className="w-3 h-3 text-[#007A61]" />
            <span>Ready</span>
          </span>
        </div>

        <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#007A61] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {formData.title ? formData.title.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-xs truncate leading-tight">
                {formData.title || 'Project Title'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Ref: {formData.challengeId}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 font-medium">Domain:</span>
              <span className="font-semibold text-slate-800">{formData.domain}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 font-medium">Lead Mentor:</span>
              <span className="font-bold text-slate-800 truncate max-w-[160px]">{formData.leadMentor}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 font-medium">Team:</span>
              <span className="font-medium text-slate-800 truncate max-w-[160px]">{formData.studentTeam} ({formData.teamMembersCount})</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 font-medium">Budget:</span>
              <span className="font-mono font-bold text-[#007A61]">₹ {totalBudget.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400 font-medium">Deadline:</span>
              <span className="font-semibold text-slate-800">{formData.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <span>Project Guidelines</span>
        </div>

        <ul className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
          <li className="flex items-start space-x-1.5">
            <span className="text-[#007A61] mt-0.5">&bull;</span>
            <span>Initiated projects automatically submit quarterly milestone proof to the State Dashboard.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <span className="text-[#007A61] mt-0.5">&bull;</span>
            <span>Seed funding grants are disbursed in 3 phases based on verified field progress.</span>
          </li>
        </ul>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center space-x-2 text-[10.5px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Synced live to Institutional Innovation Records.</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormPreview;
