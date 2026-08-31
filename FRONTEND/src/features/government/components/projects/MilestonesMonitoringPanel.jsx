import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight,
  ChevronDown,
  Check,
  Search,
  PlayCircle,
  Info,
  MapPin,
  Banknote,
  Box
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const MilestonesMonitoringPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) {
        setProjects(data.updatedProjects);
      }
    });
    return unsubscribe;
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const totalPrjs = (projects || []).length;
  const phase1Count = (projects || []).filter((p) => (p.progress || 0) >= 25).length;
  const phase2Count = (projects || []).filter((p) => (p.progress || 0) >= 50).length;
  const phase3Count = (projects || []).filter((p) => (p.progress || 0) >= 75).length;
  const phase4Count = (projects || []).filter((p) => (p.progress || 0) >= 100 || p.status === 'Completed').length;

  const phase1Pct = totalPrjs > 0 ? Math.round((phase1Count / totalPrjs) * 100) : 0;
  const phase2Pct = totalPrjs > 0 ? Math.round((phase2Count / totalPrjs) * 100) : 0;
  const phase3Pct = totalPrjs > 0 ? Math.round((phase3Count / totalPrjs) * 100) : 0;
  const phase4Pct = totalPrjs > 0 ? Math.round((phase4Count / totalPrjs) * 100) : 0;

  const filteredProjects = (projects || []).filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hei || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.district || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isCompleted = p.status === 'Completed' || (p.progress || 0) >= 100;
    const isPending = !p.milestones || p.milestones.length === 0 || p.milestones.every(m => m.status === 'Pending');
    const isInProgress = !isCompleted && !isPending;

    const matchesPhase =
      selectedPhaseFilter === 'All Stages' ||
      (selectedPhaseFilter === 'Completed' && isCompleted) ||
      (selectedPhaseFilter === 'In Progress' && isInProgress) ||
      (selectedPhaseFilter === 'Pending' && isPending);

    return matchesSearch && matchesPhase;
  });

  const handleVerifyMilestone = (projectId, milestoneId) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updatedMilestones = (prj.milestones || []).map((m) =>
            m.id === milestoneId ? { ...m, status: 'Completed', progress: 100 } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
          const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

          return {
            ...prj,
            milestones: updatedMilestones,
            progress: newProgress,
            milestoneProgress: newProgress,
            status: newProgress >= 100 ? 'Completed' : 'In Progress'
          };
        }
        return prj;
      })
    );
    showToast(`Milestone ${milestoneId} of Project ${projectId} verified & approved.`);
  };

  const toggleExpand = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Stage Gate Verification</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            MILESTONES & STAGE GATE MONITORING
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Deliverables audit trail, NABL lab test sign-offs, and tranche release verification
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          {totalPrjs} Active Projects Tracked
        </span>
      </div>

      {/* 4 Stage Gate Progress Bars Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          State Innovation Stage-Gate Completion Rates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Phase 1: Architecture</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">{phase1Pct}%</span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${phase1Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">{phase1Count} Projects Passed</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Phase 2: Prototype Build</span>
                <PlayCircle className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">{phase2Pct}%</span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-slate-900 h-full rounded-full transition-all duration-300" style={{ width: `${phase2Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">{phase2Count} Lab Verified</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Phase 3: Field Testing</span>
                <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">{phase3Pct}%</span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${phase3Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">{phase3Count} Telemetry Active</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Phase 4: State Scaling</span>
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">{phase4Pct}%</span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${phase4Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">{phase4Count} State Validated</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project ID, title, university, district..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['All Stages', 'In Progress', 'Completed', 'Pending'].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhaseFilter(phase)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                selectedPhaseFilter === phase
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List with Expandable Trackers */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
          <Info className="w-6 h-6 text-slate-300 mb-2" />
          <span className="font-bold text-slate-700 text-sm">No projects found</span>
          <span className="text-[11px] text-slate-400 mt-0.5">There are no active projects matching the current filters.</span>
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
                        <span className="flex items-center space-x-1">
                          <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-bold text-emerald-700">
                            {project.disbursedAmount && project.disbursedAmount !== '₹ 0' && project.disbursedAmount !== '0' 
                              ? project.disbursedAmount 
                              : project.sanctionedGrant || 'Pending'}
                          </span>
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
                                            handleVerifyMilestone(project.id, m.id);
                                          }}
                                          className="px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                                        >
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Verify</span>
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

      {/* Project Manage Modal */}
      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateMilestoneStatus={(prjId, mId, status) => {
          handleVerifyMilestone(prjId, mId);
        }}
      />
    </div>
  );
};

export default MilestonesMonitoringPanel;
