import React from 'react';
import { UniversityStatCards } from './UniversityStatCards.jsx';
import { UniversityPendingActions } from './UniversityPendingActions.jsx';
import { UniversityRecentActivity } from './UniversityRecentActivity.jsx';
import { UniversityAssignedChallenges } from './UniversityAssignedChallenges.jsx';
import { UniversityProjectProgress } from './UniversityProjectProgress.jsx';
import { UniversityActionModal } from './UniversityActionModal.jsx';
import { ProblemEvidenceDossierPanel } from '../../../nodal/components/ProblemEvidenceDossierPanel.jsx';
import { useUniversityDashboard } from './hooks/useUniversityDashboard.js';

export const UniversityDashboard = ({
  data: initialData,
  adminName = 'Dr. Ankit Verma',
  universityName = 'University Innovation Portal',
  universityCode = 'RU001',
  onNavigateTab,
  onUpdateChallenge
}) => {
  const {
    dashboardData,
    selectedChallenge,
    setSelectedChallenge,
    dossierChallenge,
    setDossierChallenge,
    isModalOpen,
    setIsModalOpen,
    loading,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAssignFaculty,
    handleClearActivities
  } = useUniversityDashboard({ initialData, universityCode, onUpdateChallenge });

  const liveData = dashboardData || initialData;
  const liveChallenges = liveData?.challenges || [];
  const liveCount = liveData?.kpis?.assignedChallenges?.total || liveChallenges.length || 0;
  const resolvedUniName = liveData?.name || liveData?.university?.name || universityName;

  if (dossierChallenge) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={dossierChallenge}
          onClose={() => setDossierChallenge(null)}
          isUniversityView={true}
          onAccept={(c) => { setSelectedChallenge(c); setIsModalOpen(true); }}
          onRequestClarification={(c) => { setSelectedChallenge(c); setIsModalOpen(true); }}
          onDecline={(c) => { setSelectedChallenge(c); setIsModalOpen(true); }}
          onAssignFaculty={(c) => { setSelectedChallenge(c); setIsModalOpen(true); }}
        />
        <UniversityActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          challenge={selectedChallenge}
          onAccept={(c, note) => {
            handleAcceptChallenge(c, note);
            setDossierChallenge(null);
          }}
          onDecline={(c, note) => {
            handleDeclineChallenge(c, note);
            setDossierChallenge(null);
          }}
          onAssignFaculty={(c, payload) => {
            handleAssignFaculty(c, payload);
            setDossierChallenge(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
              Higher Education R&D Hub &bull; {resolvedUniName}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Institutional Challenge & Innovation Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Authorized Nodal Officer: <strong className="text-slate-800">{adminName}</strong> &bull; Live synchronized with Jharkhand State Higher Education Cell
          </p>
        </div>
      </div>

      <UniversityStatCards
        kpis={liveData?.kpis}
        loading={loading}
        onCardClick={(tab) => onNavigateTab && onNavigateTab(tab)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <UniversityPendingActions
          actions={liveData?.pendingActions || []}
          onTriggerAction={(act) => {
            if (act.actionType === 'review_challenges') onNavigateTab && onNavigateTab('challenges');
            else if (act.actionType === 'assign_faculty') onNavigateTab && onNavigateTab('faculty');
            else if (act.actionType === 'pending_approvals') onNavigateTab && onNavigateTab('approvals');
            else onNavigateTab && onNavigateTab('challenges');
          }}
          onViewAll={() => onNavigateTab && onNavigateTab('challenges')}
        />

        <UniversityRecentActivity
          activities={liveData?.recentActivity || liveData?.recentActivities || []}
          onViewAll={() => onNavigateTab && onNavigateTab('projects')}
          onClear={handleClearActivities}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-start">
        <div className="lg:col-span-2">
          <UniversityAssignedChallenges
            challenges={liveChallenges}
            totalCount={liveCount}
            onActionClick={(c) => setDossierChallenge(c)}
            onViewAll={() => onNavigateTab && onNavigateTab('challenges')}
          />
        </div>

        <div className="lg:col-span-1">
          <UniversityProjectProgress
            projectProgress={liveData?.projectProgress || liveData?.projectProgressBreakdown}
            challenges={liveChallenges}
            universityCode={universityCode}
          />
        </div>
      </div>

      <UniversityActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challenge={selectedChallenge}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
        onAssignFaculty={handleAssignFaculty}
        onViewDossier={(c) => {
          setIsModalOpen(false);
          setDossierChallenge(c);
        }}
      />
    </div>
  );
};

export default UniversityDashboard;
