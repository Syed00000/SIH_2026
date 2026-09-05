import React from 'react';
import { Box, CheckCircle2, Building2, MapPin, Banknote, ChevronDown, Layers, Check, Rocket } from 'lucide-react';

export const MilestoneDeliveryTracker = ({ project, isExpanded, onToggleExpand, onVerifyMilestone, onOpenDeployTerms, onViewDeployedSuccess }) => {
  const isCompleted = project.status === 'Completed' || project.status === 'Deployed' || (project.progress || 0) >= 100;
  
  const milestonesList = (project.milestones || []).map((m, idx) => {
    let mStatus = m.status;
    const hasFunds = project.disbursedAmount && project.disbursedAmount !== '₹ 0' && project.disbursedAmount !== '0';
    if ((m.title?.toLowerCase().includes('disbursal') || m.title?.toLowerCase().includes('budget') || idx === 4) && hasFunds) {
      if (mStatus !== 'Completed' && mStatus !== 'COMPLETED') mStatus = 'Completed';
    }
    return { ...m, status: mStatus };
  });

  const allMilestonesCompleted = milestonesList.length > 0 && milestonesList.every(m => m.status === 'Completed' || m.status === 'COMPLETED');
  const isDeployed = project.isDeployed || project.status === 'Deployed';

  return (
    <div className={`bg-white border rounded-2xl transition-all duration-200 shadow-2xs overflow-hidden ${isExpanded ? 'border-slate-400 ring-4 ring-slate-100' : 'border-slate-200 hover:border-slate-300'}`}>
      {/* Collapsed Header */}
      <div 
        className={`p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isExpanded ? 'bg-slate-50/50 border-b border-slate-200' : ''}`}
        onClick={() => onToggleExpand(project.id)}
      >
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <Box className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{project.title}</h3>
              <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{project.id}</span>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold ml-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className={isCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                  {isDeployed ? 'Deployed' : (isCompleted ? 'Completed' : 'In Progress')} ({project.progress || 0}%)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /><span className="font-medium text-slate-700">{project.hei}</span></span>
              <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{project.district}</span></span>
              <span className="flex items-center space-x-1"><Banknote className="w-3.5 h-3.5 text-emerald-500" /><span className="font-bold text-emerald-700">{project.disbursedAmount || project.sanctionedGrant || 'Pending'}</span></span>
            </div>
          </div>
        </div>

        <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? '-rotate-90 bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Expanded Delivery Tracker */}
      {isExpanded && (
        <div className="p-5 md:p-6 bg-slate-50/50 space-y-6">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5" /><span>Milestone Delivery Tracker</span>
          </h4>

          {milestonesList.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No milestones mapped for this project yet.</div>
          ) : (
            <div className="relative pl-3 md:pl-5">
              <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-full" />
              <div className="space-y-6">
                {milestonesList.map((m, idx) => {
                  const mCompleted = m.status === 'Completed' || m.status === 'COMPLETED';
                  const mInProgress = m.status === 'In Progress' || m.status === 'CURRENT';

                  return (
                    <div key={m.id || idx} className="relative pl-10 md:pl-12 flex items-start gap-4">
                      <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                        mCompleted ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' : mInProgress ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-300'
                      }`}>
                        {mCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <span className={`text-[11px] font-black ${mInProgress ? 'text-amber-500' : 'text-slate-400'}`}>{idx + 1}</span>}
                      </div>

                      <div className={`flex-1 border rounded-xl p-3.5 transition-colors shadow-2xs ${mCompleted ? 'bg-emerald-50/30 border-emerald-100' : mInProgress ? 'bg-white border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h5 className={`text-sm font-bold ${mCompleted ? 'text-emerald-900' : mInProgress ? 'text-amber-900' : 'text-slate-700'}`}>{m.title}</h5>
                            <span className="text-[11px] text-slate-500 font-medium">{m.description || `Phase ${idx + 1} deliverable execution`}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${mCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : mInProgress ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {m.status}
                            </span>
                            {!mCompleted && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onVerifyMilestone(project.id, m.id); }}
                                className="px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400" /><span>Verify</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ready to Deploy Action Box */}
          <div className="pt-4 border-t border-slate-200">
            {isDeployed ? (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-950 text-xs shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#007A61] shrink-0" />
                  <div>
                    <span className="font-black block">✓ State Solution Successfully Deployed &amp; Active</span>
                    <span className="text-[11px] text-emerald-800">Live citizen telemetry and prototype dossier published to Citizen Registry.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onViewDeployedSuccess(project); }}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-[#007A61] border border-emerald-300 rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs"
                >
                  View Deployment
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Rocket className="w-4 h-4 text-[#007A61]" /><span>Public Rollout &amp; State Deployment Gate</span>
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {allMilestonesCompleted
                      ? 'All milestone stages and testing validations are 100% verified. Clear for State Deployment.'
                      : 'Complete and verify all milestone stages above to activate official state deployment.'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!allMilestonesCompleted}
                  onClick={(e) => { e.stopPropagation(); onOpenDeployTerms(project); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shrink-0 ${
                    allMilestonesCompleted
                      ? 'bg-[#007A61] hover:bg-[#00604c] text-white shadow-md cursor-pointer animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  <span>{allMilestonesCompleted ? 'Ready to Deploy' : 'Deployment Locked'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneDeliveryTracker;
