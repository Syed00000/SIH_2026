import React from 'react';
import { FacultyWelcomeBanner } from './FacultyWelcomeBanner.jsx';
import { FacultyKpiGrid } from './FacultyKpiGrid.jsx';
import { MentoredProjectsSection } from './MentoredProjectsSection.jsx';
import { FacultyRoadmapCard } from './FacultyRoadmapCard.jsx';

export const FacultyDashboard = ({
  faculty,
  challenges = [],
  projects = [],
  onNavigateTab,
  onSelectProject,
  onSelectChallenge
}) => {
  const activeProjects = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Active' || (p.disbursedAmount && p.disbursedAmount !== '0')
  );
  const proposalsPending = projects.filter(
    (p) => !p.sanctionedBudget || p.status === 'Proposal Stage' || p.status === 'Planning'
  );
  const totalTeamMembers = projects.reduce((acc, p) => acc + (p.teamMembers?.length || 0), 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Welcome Banner */}
      <FacultyWelcomeBanner faculty={faculty} />

      {/* KPI Stats Grid */}
      <FacultyKpiGrid
        challengesCount={challenges.length}
        proposalsPendingCount={proposalsPending.length}
        totalTeamMembers={totalTeamMembers}
        activeProjectsCount={activeProjects.length}
        onNavigateTab={onNavigateTab}
      />

      {/* Main Section: Mentored Projects & Action Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MentoredProjectsSection
            projects={projects}
            onNavigateTab={onNavigateTab}
          />
        </div>

        <div className="space-y-3.5">
          <FacultyRoadmapCard
            projects={projects}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
