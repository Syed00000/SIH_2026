import React from 'react';
import { NodalStatCards } from './NodalStatCards.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { useNodalOverviewData } from './overview/hooks/useNodalOverviewData.js';
import { NodalWelcomeBanner } from './overview/NodalWelcomeBanner.jsx';
import { NodalUnassignedQueueCard } from './overview/NodalUnassignedQueueCard.jsx';
import { NodalInstitutionalAllocationCard } from './overview/NodalInstitutionalAllocationCard.jsx';
import { NodalProcessWorkflowCard } from './overview/NodalProcessWorkflowCard.jsx';

export const NodalOverview = ({ onNavigateChallenges, onNavigateUniversities }) => {
  const {
    stats,
    allChallenges,
    universities,
    loading,
    selectedChallenge,
    isAssignModalOpen,
    loadData,
    handleOpenAssignModal,
    handleCloseAssignModal
  } = useNodalOverviewData();

  return (
    <div className="space-y-5 select-none text-left animate-in fade-in duration-150">
      {/* 1. Header Card with Quick Action */}
      <NodalWelcomeBanner
        onNavigateChallenges={onNavigateChallenges}
        onNavigateUniversities={onNavigateUniversities}
        onReload={loadData}
        loading={loading}
      />

      {/* 2. Top Metric KPI Grid */}
      <NodalStatCards stats={stats} loading={loading} />

      {/* 3. Operational Dashboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <NodalUnassignedQueueCard
          challenges={allChallenges}
          onNavigateChallenges={onNavigateChallenges}
          onOpenAssign={handleOpenAssignModal}
        />

        <NodalInstitutionalAllocationCard
          universities={universities}
          challenges={allChallenges}
          onNavigateUniversities={onNavigateUniversities}
        />
      </div>

      {/* 4. State Triage Workflow Guide */}
      <NodalProcessWorkflowCard />

      {/* Triage / Assignment Modal */}
      {isAssignModalOpen && (
        <NodalAssignModal
          isOpen={isAssignModalOpen}
          onClose={handleCloseAssignModal}
          challenge={selectedChallenge}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default NodalOverview;
