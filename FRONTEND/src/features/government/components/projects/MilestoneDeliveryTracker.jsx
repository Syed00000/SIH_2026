import React from 'react';
import { Box, CheckCircle2, Building2, MapPin, Banknote, ChevronDown, Layers } from 'lucide-react';
import { computeDynamicMilestones } from '../../../../shared/utils/milestonesHelper.js';
export { computeDynamicMilestones };

export const MilestoneDeliveryTracker = ({ project, isExpanded, onToggleExpand, onVerifyMilestone }) => {
  const dynamicMilestones = computeDynamicMilestones(project);
  const milestonesList = dynamicMilestones.map((dm) => {
    const existing = (project.milestones || []).find((m) => m.id === dm.id || m.title === dm.title);
    if (existing?.status === 'Completed' || existing?.status === 'COMPLETED') {
      return { ...dm, status: 'Completed' };
    }
    return dm;
  });

  const completedCount = milestonesList.filter((m) => m.status === 'Completed').length;
  const computedProgress = Math.round((completedCount / 7) * 100);
  const displayProgress = project.progress ? Math.max(project.progress, computedProgress) : computedProgress;
  const isCompleted = displayProgress >= 100;
  const isDeployed = Boolean(project.isDeployed || project.status === 'Deployed' || isCompleted);

  return (
    <div className={`bg-white border transition-all duration-200 shadow-xs rounded-xs overflow-hidden ${isExpanded ? 'border-slate-400 ring-2 ring-slate-100' : 'border-slate-200 hover:border-slate-300'}`}>
      {/* Collapsed Header */}
      <div 
        className={`p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-200' : ''}`}
        onClick={() => onToggleExpand(project.id)}
      >
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className={`w-9 h-9 rounded-xs flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-slate-100 border border-slate-200 text-slate-700'}`}>
            <Box className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 truncate">{project.title}</h3>
              <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">{project.id}</span>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold ml-1">
                <span className={`w-1.5 h-1.5 rounded-xs ${isCompleted ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                <span className={isCompleted ? 'text-emerald-800' : 'text-amber-800'}>
                  {isDeployed ? 'Publicly Deployed' : (isCompleted ? 'Milestones Completed' : 'In Progress')} ({displayProgress}%)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 text-slate-400" /><span className="font-medium text-slate-700">{project.hei}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{project.district}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Banknote className="w-3.5 h-3.5 text-[#007A61]" /><span className="font-bold text-[#007A61]">{project.disbursedAmount || project.sanctionedGrant || 'Pending'}</span></span>
            </div>
          </div>
        </div>

        <div className={`p-1 rounded-xs transition-transform duration-200 ${isExpanded ? '-rotate-90 bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500'}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Expanded Delivery Tracker */}
      {isExpanded && (
        <div className="p-4 md:p-5 bg-slate-50 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1 flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-[#007A61]" /><span>Institutional Milestone Delivery Tracking</span>
          </h4>

          {milestonesList.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No milestones recorded for this project yet.</div>
          ) : (
            <div className="relative pl-3 md:pl-5">
              <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-xs" />
              <div className="space-y-4">
                {milestonesList.map((m, idx) => {
                  const mCompleted = m.status === 'Completed' || m.status === 'COMPLETED';
                  const mInProgress = m.status === 'In Progress' || m.status === 'CURRENT';

                  return (
                    <div key={m.id || idx} className="relative pl-9 md:pl-11 flex items-start gap-3">
                      <div className={`absolute left-0 w-7 h-7 rounded-xs border-2 flex items-center justify-center z-10 bg-white ${
                        mCompleted ? 'border-emerald-600 shadow-xs' : mInProgress ? 'border-amber-500' : 'border-slate-300'
                      }`}>
                        {mCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span className={`text-[10.5px] font-bold ${mInProgress ? 'text-amber-600' : 'text-slate-400'}`}>{idx + 1}</span>}
                      </div>

                      <div className={`flex-1 border rounded-xs p-3 transition-colors shadow-xs ${mCompleted ? 'bg-emerald-50/40 border-emerald-200' : mInProgress ? 'bg-white border-amber-300' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h5 className={`text-xs font-bold ${mCompleted ? 'text-emerald-900' : mInProgress ? 'text-amber-900' : 'text-slate-900'}`}>{m.title}</h5>
                            <span className="text-[11px] text-slate-500 font-medium">{m.description || `Phase ${idx + 1} deliverable execution`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border whitespace-nowrap ${mCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : mInProgress ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MilestoneDeliveryTracker;
