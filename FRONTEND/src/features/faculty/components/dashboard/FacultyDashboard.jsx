import React from 'react';
import { RotateCcw, ArrowRight, AlertTriangle } from 'lucide-react';
import { FacultyWelcomeBanner } from './FacultyWelcomeBanner.jsx';
import { FacultyKpiGrid } from './FacultyKpiGrid.jsx';
import { MentoredProjectsSection } from './MentoredProjectsSection.jsx';

export const FacultyDashboard = ({
  faculty,
  challenges = [],
  projects = [],
  onNavigateTab,
  onSelectProject,
  onSelectChallenge
}) => {
  const revisionProjects = projects.filter((p) => {
    const bStatus = String(p.budgetStatus || '').toLowerCase();
    const pStatus = String(p.prototypeStatus || '').toLowerCase();
    const gStatus = String(p.governmentStatus || '').toLowerCase();
    const status = String(p.status || '').toLowerCase();
    return (
      bStatus.includes('changes required') ||
      pStatus.includes('changes required') ||
      gStatus.includes('changes required') ||
      status.includes('changes required') ||
      Boolean(p.adminRemarks && (bStatus.includes('changes') || pStatus.includes('changes')))
    );
  });

  const activeProjects = projects.filter(
    (p) => (p.status === 'In Progress' || p.status === 'Active' || (p.disbursedAmount && p.disbursedAmount !== '0')) && p.status !== 'Completed' && p.governmentStatus !== 'Approved'
  );
  const proposalsPending = projects.filter(
    (p) => !p.sanctionedBudget || p.status === 'Proposal Stage' || p.status === 'Planning'
  );
  const resolvedProjects = projects.filter(
    (p) => p.status === 'Completed' || p.progressPercentage === 100 || p.governmentStatus === 'Approved'
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      {/* Welcome Banner */}
      <FacultyWelcomeBanner faculty={faculty} />

      {/* Active Revision Request Callout Banner */}
      {revisionProjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left shadow-2xs">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  University Authority Revision Directives
                </span>
                <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
                  {revisionProjects.length} Action Needed
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5 font-medium">
                University Authority requested revisions on {revisionProjects.map(p => `"${p.title}"`).join(', ')}. Review remarks and update blueprint.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('revisions')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <span>Review Revisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <FacultyKpiGrid
        challengesCount={challenges.length}
        proposalsPendingCount={proposalsPending.length}
        activeProjectsCount={activeProjects.length}
        resolvedProjectsCount={resolvedProjects.length}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Section: Mentored Projects */}
      <div className="space-y-4">
        <MentoredProjectsSection
          projects={projects}
          onNavigateTab={onNavigateTab}
        />
      </div>
    </div>
  );
};

export default FacultyDashboard;
