import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Zap,
  Search,
  ExternalLink,
  Award,
  Info,
  PlayCircle
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const MilestonesMonitoringPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
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

  const allMilestones = (projects || []).flatMap((p) =>
    (p.milestones || []).map((m) => ({
      ...m,
      projectId: p.id,
      projectTitle: p.title,
      hei: p.hei,
      sector: p.sector,
      district: p.district,
      trlLevel: p.trlLevel,
      sanctionedGrant: p.sanctionedGrant,
      disbursedAmount: p.disbursedAmount,
      parentProject: p
    }))
  );

  const totalPrjs = (projects || []).length;
  const phase1Count = (projects || []).filter((p) => (p.progress || 0) >= 25).length;
  const phase2Count = (projects || []).filter((p) => (p.progress || 0) >= 50).length;
  const phase3Count = (projects || []).filter((p) => (p.progress || 0) >= 75).length;
  const phase4Count = (projects || []).filter((p) => (p.progress || 0) >= 100 || p.status === 'Completed').length;

  const phase1Pct = totalPrjs > 0 ? Math.round((phase1Count / totalPrjs) * 100) : 0;
  const phase2Pct = totalPrjs > 0 ? Math.round((phase2Count / totalPrjs) * 100) : 0;
  const phase3Pct = totalPrjs > 0 ? Math.round((phase3Count / totalPrjs) * 100) : 0;
  const phase4Pct = totalPrjs > 0 ? Math.round((phase4Count / totalPrjs) * 100) : 0;

  const filteredMilestones = allMilestones.filter((m) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.hei.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPhase =
      selectedPhaseFilter === 'All Stages' ||
      (selectedPhaseFilter === 'Completed' && m.status === 'Completed') ||
      (selectedPhaseFilter === 'In Progress' && m.status === 'In Progress') ||
      (selectedPhaseFilter === 'Pending' && m.status === 'Pending');

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
            milestoneProgress: newProgress
          };
        }
        return prj;
      })
    );
    showToast(`Milestone ${milestoneId} of ${projectId} verified & approved.`);
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
          {allMilestones.length} Total Tracked Milestones
        </span>
      </div>

      {/* 4 Stage Gate Progress Bars Banner (Computed from live data) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          State Innovation Stage-Gate Completion Rates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Phase 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Phase 1: Architecture
                </span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  {phase1Pct}%
                </span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${phase1Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
              {phase1Count} Projects Passed
            </div>
          </div>

          {/* Card 2: Phase 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Phase 2: Prototype Build
                </span>
                <PlayCircle className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  {phase2Pct}%
                </span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-slate-900 h-full rounded-full transition-all duration-300" style={{ width: `${phase2Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
              {phase2Count} Lab Verified
            </div>
          </div>

          {/* Card 3: Phase 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Phase 3: Field Testing
                </span>
                <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  {phase3Pct}%
                </span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${phase3Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
              {phase3Count} Telemetry Active
            </div>
          </div>

          {/* Card 4: Phase 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Phase 4: State Scaling
                </span>
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  {phase4Pct}%
                </span>
                <span className="text-[10px] text-slate-600 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Active
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${phase4Pct}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
              {phase4Count} State Validated
            </div>
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
            placeholder="Search milestone deliverable, project ID, institution..."
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

      {/* Milestones Audit Feed */}
      {filteredMilestones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
          <Info className="w-6 h-6 text-slate-300 mb-2" />
          <span className="font-bold text-slate-700 text-sm">No stage-gate milestones recorded</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Approved university project deliverables and lab verification milestones will be tracked here.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMilestones.map((m, idx) => {
            const isCompleted = m.status === 'Completed';
            const isInProgress = m.status === 'In Progress';

            return (
              <div
                key={`${m.projectId}-${m.id}-${idx}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 flex-shrink-0">
                    {m.id}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 ml-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isInProgress
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-slate-400'
                        } shrink-0`}></span>
                        <span>{m.status} ({m.progress}%)</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-800 ml-1">
                        {m.trlLevel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1.5">
                      <span className="font-semibold text-slate-900">
                        {m.projectTitle} ({m.projectId})
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.hei}</span>
                      </span>
                      <span>•</span>
                      <span>{m.district}</span>
                      {m.remarks && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-600">"{m.remarks}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleVerifyMilestone(m.projectId, m.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verify & Approve</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(m.parentProject);
                      setIsManageModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Audit Dossier</span>
                  </button>
                </div>
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
