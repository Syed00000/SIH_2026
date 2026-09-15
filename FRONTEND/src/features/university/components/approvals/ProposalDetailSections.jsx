import React from 'react';
import { FileText, Layers, Users, Crown } from 'lucide-react';

export const ProposalDetailSections = ({ approval, totalFormatted, effectiveExtraNum }) => {
  const teamResearchers = (Array.isArray(approval.teamMembers) && approval.teamMembers.length)
    ? approval.teamMembers
    : (Array.isArray(approval.team?.members) && approval.team.members.length)
    ? approval.team.members
    : [];

  const teamName = approval.studentTeam || approval.teamName || approval.team?.name || 'Student Research Team';

  return (
    <>
      {/* Student Research Team Roster */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Assigned Student Research Team: <span className="text-[#007A61]">{teamName}</span>
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {teamResearchers.length} Student Researchers
          </span>
        </div>
        {teamResearchers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {teamResearchers.map((m, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/90 space-y-0.5 text-xs">
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span className="truncate">{m.name}</span>
                  {m.isLead && (
                    <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1 py-0.2 rounded border border-amber-300 flex items-center space-x-0.5">
                      <Crown className="w-2.5 h-2.5" />
                      <span>LEAD</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 truncate">{m.department || 'Engineering'}</div>
                {m.rollNo && <div className="text-[10px] text-slate-400 font-mono">Roll: {m.rollNo}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
            Squad "{teamName}" configured and assigned by Faculty Mentor.
          </div>
        )}
      </div>

      {/* Technical Methodology & Research Plan */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Technical Methodology &amp; Research Plan
          </h3>
        </div>
        <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 whitespace-pre-wrap">
          {approval.methodology || 'No detailed methodology provided by mentor.'}
        </div>
      </div>

      {/* Faculty Milestone Roadmap & Stages */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Faculty Milestone Roadmap &amp; Research Stages
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(Array.isArray(approval.milestoneRoadmap) && approval.milestoneRoadmap.length > 0
            ? approval.milestoneRoadmap
            : [
                { stage: 1, title: 'Lab CAD & Circuit Rig', targetDays: 'Days 1-30', deliverable: 'Component procurement, PCB milling, sensor bench test' },
                { stage: 2, title: 'Field Ground Testing', targetDays: 'Days 31-75', deliverable: 'Telemetry calibration in rural pilot site' },
                { stage: 3, title: 'NABL Lab Certification', targetDays: 'Days 76-120', deliverable: 'Safety and quality standard test report' },
                { stage: 4, title: 'Public Rollout & Scale', targetDays: 'Days 121-180', deliverable: 'Deployment and handover to district administration' }
              ]
          ).map((stage, sIdx) => (
            <div key={sIdx} className="p-3 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-1.5 hover:bg-emerald-50/20 transition-all">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-black text-[#007A61] uppercase tracking-wide">Stage {stage.stage || sIdx + 1}</span>
                <span className="font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200/80">{stage.targetDays || `Phase ${sIdx + 1}`}</span>
              </div>
              <div className="text-xs font-black text-slate-900 leading-snug">{stage.title}</div>
              {stage.deliverable && (
                <div className="text-[10.5px] text-slate-600 leading-relaxed pt-0.5">{stage.deliverable}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Line-Item Budget Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Itemized Line-Item Budget Allocation
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Grant Requested</span>
            <span className="text-base font-black font-mono text-[#007A61]">{totalFormatted}</span>
            {effectiveExtraNum > 0 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded block mt-0.5">
                +₹ {effectiveExtraNum.toLocaleString('en-IN')} Extra from Faculty
              </span>
            )}
          </div>
        </div>

        {Array.isArray(approval.budgetBreakdown) && approval.budgetBreakdown.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {approval.budgetBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-xs"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200 text-[11px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {item.category || item.title}
                  </span>
                </div>
                <span className="font-mono font-extrabold text-slate-900 text-xs shrink-0">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-500 font-semibold">
            Single grant allocation of {approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'}
          </div>
        )}
      </div>
    </>
  );
};

export default ProposalDetailSections;
