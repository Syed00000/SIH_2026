import React from 'react';
import { UniversityStatCards } from './UniversityStatCards.jsx';
import { UniversityPendingActions } from './UniversityPendingActions.jsx';
import { UniversityRecentActivity } from './UniversityRecentActivity.jsx';
import { UniversityAssignedChallenges } from './UniversityAssignedChallenges.jsx';
import { UniversityProjectProgress } from './UniversityProjectProgress.jsx';
import { UniversityActionModal } from './UniversityActionModal.jsx';
import { ProblemEvidenceDossierPanel } from '../../../nodal/components/ProblemEvidenceDossierPanel.jsx';
import { useUniversityDashboard } from './hooks/useUniversityDashboard.js';
import { UniversityDashboardMainChart } from './UniversityDashboardMainChart.jsx';
import { UniversityDashboardRightWidgets } from './UniversityDashboardRightWidgets.jsx';

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

  const handleExport = () => {
    if (!liveChallenges || liveChallenges.length === 0) return;
    
    const headers = ['Challenge ID', 'Title', 'Domain', 'Status', 'Priority', 'Assigned Faculty', 'Date'];
    const csvRows = [headers.join(',')];
    
    liveChallenges.forEach(c => {
      const row = [
        `"${c.id || c.challengeId || ''}"`,
        `"${(c.title || '').replace(/"/g, '""')}"`,
        `"${c.domain || ''}"`,
        `"${c.status || ''}"`,
        `"${c.priority || ''}"`,
        `"${c.assignedFaculty?.name || 'Not Assigned'}"`,
        `"${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Challenges_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto">
      <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-[22px] font-black text-slate-800 tracking-tight font-sans">
            Ranchi University Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-[#007A61] text-white text-[13px] font-bold rounded-xl border border-[#006b55] shadow-sm hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exports</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 max-w-[1400px] mx-auto select-none p-4 w-full">
        <UniversityStatCards
          kpis={liveData?.kpis}
          loading={loading}
          onCardClick={(tab) => onNavigateTab && onNavigateTab(tab)}
        />

        {/* Middle Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col h-full">
            <UniversityDashboardMainChart challenges={liveChallenges} />
          </div>
          <div className="lg:col-span-1 flex flex-col h-full">
            <UniversityDashboardRightWidgets challenges={liveChallenges} kpis={liveData?.kpis} />
          </div>
        </div>

        {/* Bottom Table Row */}
        <div className="mt-6 mb-8">
          <UniversityAssignedChallenges
            challenges={liveChallenges}
            totalCount={liveCount}
            onActionClick={(c) => setDossierChallenge(c)}
            onViewAll={() => onNavigateTab && onNavigateTab('challenges')}
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
