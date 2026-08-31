import React, { useState } from 'react';
import {
  CheckCircle2,
  Layers,
  ChevronDown,
  Check,
  Building2,
  MapPin,
  Banknote,
  Box,
  Info
} from 'lucide-react';

export const MilestonesTrackingView = ({ projects = [], onManageProject }) => {
  const [selectedPhase, setSelectedPhase] = useState('All Phases');
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const filteredProjects = projects.filter((p) => {
    const isCompleted = p.status === 'Completed' || (p.progress || 0) >= 100;
    const isPending = !p.milestones || p.milestones.length === 0 || p.milestones.every(m => m.status === 'Pending');
    const isInProgress = !isCompleted && !isPending;

    if (selectedPhase === 'All Phases') return true;
    if (selectedPhase === 'Completed') return isCompleted;
    if (selectedPhase === 'In Progress') return isInProgress;
    if (selectedPhase === 'Pending') return isPending;
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Milestones & Stage Gate Compliance
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Deliverables audit trail and technical milestone sign-offs for sanctioned innovations
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['All Phases', 'In Progress', 'Completed', 'Pending'].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                selectedPhase === phase
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center shadow-2xs">
          <Info className="w-6 h-6 text-slate-300 mb-2" />
          <span className="font-bold text-slate-700 text-sm">No projects found</span>
          <span className="text-[11px] text-slate-400 mt-0.5">There are no projects matching the current phase filter.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'Completed' || (project.progress || 0) >= 100;
            const isExpanded = expandedProjectId === project.id;
            const milestonesList = project.milestones || [];
            
            return (
              <div key={project.id} className={`bg-white border rounded-2xl transition-all duration-200 shadow-2xs overflow-hidden ${isExpanded ? 'border-slate-400 ring-4 ring-slate-100' : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'}`}>
                {/* Collapsed Header / Project Card */}
                <div 
                  className={`p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isExpanded ? 'bg-slate-50/50 border-b border-slate-200' : ''}`}
                  onClick={() => toggleExpand(project.id)}
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                      <Box className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{project.title}</h3>
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {project.id}
                        </span>
                        <div className="flex items-center space-x-1.5 text-[11px] font-bold ml-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                          <span className={isCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                            {isCompleted ? 'Completed' : 'In Progress'} ({project.progress || 0}%)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">{project.hei}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{project.district}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                    <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? '-rotate-90 bg-slate-200 text-slate-800' : 'bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-800'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Delivery Tracker View (Expanded State) */}
                {isExpanded && (
                  <div className="p-5 md:p-6 bg-slate-50/50">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1 flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Milestone Delivery Tracker</span>
                    </h4>

                    {milestonesList.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        No milestones mapped for this project yet.
                      </div>
                    ) : (
                      <div className="relative pl-3 md:pl-5">
                        {/* Vertical Progress Line */}
                        <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-full"></div>

                        <div className="space-y-6">
                          {milestonesList.map((m, idx) => {
                            const mCompleted = m.status === 'Completed' || m.status === 'COMPLETED';
                            const mInProgress = m.status === 'In Progress' || m.status === 'CURRENT';

                            return (
                              <div key={m.id || idx} className="relative pl-10 md:pl-12 flex items-start gap-4">
                                {/* Tracker Bubble */}
                                <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors bg-white ${
                                  mCompleted 
                                    ? 'border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]' 
                                    : mInProgress 
                                    ? 'border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.15)] ring-2 ring-amber-100' 
                                    : 'border-slate-300'
                                }`}>
                                  {mCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <span className={`text-[11px] font-black ${mInProgress ? 'text-amber-500' : 'text-slate-400'}`}>
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>

                                {/* Milestone Content Card */}
                                <div className={`flex-1 border rounded-xl p-3.5 transition-colors shadow-2xs ${
                                  mCompleted 
                                    ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200' 
                                    : mInProgress 
                                    ? 'bg-white border-amber-200 hover:border-amber-300' 
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                      <h5 className={`text-sm font-bold ${mCompleted ? 'text-emerald-900' : mInProgress ? 'text-amber-900' : 'text-slate-700'}`}>
                                        {m.title}
                                      </h5>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                          {m.description || `Phase ${idx + 1} deliverable execution`}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                                        mCompleted 
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                          : mInProgress 
                                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                          : 'bg-slate-100 text-slate-500 border-slate-200'
                                      }`}>
                                        {m.status} {m.progress ? `(${m.progress}%)` : ''}
                                      </span>

                                      {!mCompleted && !m.title?.toLowerCase().includes('disbursal') && !m.title?.toLowerCase().includes('sanction') && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onManageProject && onManageProject(project);
                                          }}
                                          className="px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                                        >
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Manage</span>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MilestonesTrackingView;
