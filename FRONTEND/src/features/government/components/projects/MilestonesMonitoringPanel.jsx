import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { INITIAL_ACTIVE_PROJECTS } from '../../data/projectsSolutionsData.js';

export const MilestonesMonitoringPanel = () => {
  const [projects, setProjects] = useState(INITIAL_ACTIVE_PROJECTS);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const allMilestones = projects.flatMap((p) =>
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

      {/* 4 Stage Gate Progress Bars Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          State Innovation Stage-Gate Completion Rates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Phase 1: Architecture</span>
              <span className="text-emerald-700">92%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
            </div>
            <span className="text-[10px] text-slate-500 block">26 Projects Passed</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Phase 2: Prototype Build</span>
              <span className="text-slate-900">74%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-900 h-full rounded-full" style={{ width: '74%' }} />
            </div>
            <span className="text-[10px] text-slate-500 block">18 Lab Verified</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Phase 3: Field Testing</span>
              <span className="text-amber-700">58%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '58%' }} />
            </div>
            <span className="text-[10px] text-slate-500 block">14 Telemetry Active</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Phase 4: State Scaling</span>
              <span className="text-blue-700">32%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '32%' }} />
            </div>
            <span className="text-[10px] text-slate-500 block">7 State Validated</span>
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
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isInProgress
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {m.id}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.status} ({m.progress}%)
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                      {m.trlLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
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
                    <span>•</span>
                    <span className="italic text-slate-600">"{m.remarks}"</span>
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
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audit Dossier</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
