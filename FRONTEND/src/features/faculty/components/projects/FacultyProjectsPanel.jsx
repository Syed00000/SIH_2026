import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calculator,
  Users,
  Send,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

export const FacultyProjectsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  onNavigateTab
}) => {
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [updating, setUpdating] = useState(false);

  const handleAdvanceMilestone = async (project, milestoneId) => {
    setUpdating(true);
    try {
      const updatedMilestones = project.milestones?.map((m) => {
        if (m.id === milestoneId) {
          return { ...m, status: 'Completed', completedAt: new Date() };
        }
        if (m.id === milestoneId + 1 && m.status === 'Pending') {
          return { ...m, status: 'In Progress' };
        }
        return m;
      }) || [];

      const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
      const progressPercentage = Math.round((completedCount / 7) * 100);

      const updated = {
        ...project,
        milestones: updatedMilestones,
        milestonesCompleted: completedCount,
        progressPercentage,
        status: progressPercentage === 100 ? 'Completed' : 'In Progress'
      };

      await universityApiService.updateProject(project.projectId || project._id, updated);
      setSelectedProject(updated);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Milestone advance error:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Faculty Research Node</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">R&D Projects & Prototypes</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-[#007A61]" />
            <span>Active Prototyping & Project Tracking</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor R&D milestones, student engineering progress, and district pilot trial handovers.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Active Projects</h3>
          <p className="text-xs max-w-md mx-auto">
            When Ranchi University assigns problem statements to you, your active R&D workspaces will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Project List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Mentored Projects ({projects.length})
            </h3>
            {projects.map((p, idx) => {
              const isSelected = (selectedProject?.projectId || selectedProject?.challengeId) === (p.projectId || p.challengeId);
              const done = p.milestonesCompleted || 1;
              const pct = p.progressPercentage || Math.round((done / 7) * 100);

              return (
                <div
                  key={p.projectId || idx}
                  onClick={() => setSelectedProject(p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs ${
                    isSelected
                      ? 'bg-emerald-50/50 border-[#007A61] ring-1 ring-[#007A61]'
                      : 'bg-white border-slate-200/90 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                      {p.projectId}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {p.status || 'Proposal Stage'}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2">
                    {p.title}
                  </h4>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                      <span>Progress</span>
                      <span className="font-mono text-[#007A61] font-bold">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#007A61] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Details & Milestone Stepper */}
          {selectedProject && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Top Info */}
                <div className="space-y-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {selectedProject.projectId}
                    </span>
                    <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedProject.domain}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProject.problemStatement || selectedProject.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned Grant</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                      {selectedProject.sanctionedBudget || (selectedProject.budget && selectedProject.budget !== 'N/A' ? selectedProject.budget : 'N/A (Pending Proposal)')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Team</span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
                      {selectedProject.teamMembers?.length ? `${selectedProject.teamMembers.length} Researchers` : 'Formation in Progress'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Progress Seekbar</span>
                    <span className="font-extrabold text-[#007A61] text-xs mt-0.5 block">
                      {selectedProject.progressPercentage || 14}% ({selectedProject.milestonesCompleted || 1}/7 Steps)
                    </span>
                  </div>
                </div>

                {/* 7-Step Milestones */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    R&D Lifecycle Milestone Stepper
                  </h3>

                  {(selectedProject.milestones || []).map((m, idx) => {
                    const isDone = m.status === 'Completed';
                    const isCurrent = m.status === 'In Progress';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : isCurrent
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-1 ring-amber-300/60'
                            : 'bg-slate-50/80 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                              isDone
                                ? 'bg-[#007A61] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs block leading-tight">{m.title}</span>
                            <span className="text-[10px] text-slate-500">Status: {m.status}</span>
                          </div>
                        </div>

                        {isCurrent && (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() => handleAdvanceMilestone(selectedProject, m.id)}
                            className="px-2.5 py-1 bg-[#007A61] hover:bg-[#006650] text-white text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Done'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyProjectsPanel;
