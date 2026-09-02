import React from 'react';
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
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Welcome Banner */}
      <FacultyWelcomeBanner faculty={faculty} />

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
