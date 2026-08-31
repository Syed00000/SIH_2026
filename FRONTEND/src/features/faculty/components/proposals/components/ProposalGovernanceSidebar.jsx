import React from 'react';

export const ProposalGovernanceSidebar = ({ currentProject, totalCalculatedBudget }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Governance & Approval Status
        </h3>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Review Status</span>
            <div className="font-bold text-xs text-slate-900">
              {currentProject?.budgetStatus || 'Proposal Formulated'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Sanctioned Grant Budget</span>
            <div className="font-black font-mono text-xs text-[#007A61]">
              {currentProject?.sanctionedBudget || currentProject?.proposedBudget || `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Research Team Lead</span>
            <div className="font-bold text-xs text-slate-800">
              {currentProject?.studentLead || currentProject?.studentTeam || 'Student Research Team'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGovernanceSidebar;
