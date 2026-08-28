import React, { useState, useEffect } from 'react';
import { UniversityStatCards } from './UniversityStatCards.jsx';
import { UniversityPendingActions } from './UniversityPendingActions.jsx';
import { UniversityRecentActivity } from './UniversityRecentActivity.jsx';
import { UniversityAssignedChallenges } from './UniversityAssignedChallenges.jsx';
import { UniversityProjectProgress } from './UniversityProjectProgress.jsx';
import { UniversityActionModal } from './UniversityActionModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityDashboard = ({
  data: initialData,
  adminName = 'Dr. Ankit Verma',
  onNavigateTab,
  onUpdateChallenge
}) => {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(!initialData);

  const loadLiveDashboard = async () => {
    setLoading(true);
    const summary = await universityApiService.getDashboardSummary('RU001');
    if (summary) {
      setDashboardData(summary);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialData) {
      setDashboardData(initialData);
      setLoading(false);
    } else {
      loadLiveDashboard();
    }
  }, [initialData]);

  const handleChallengeAction = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleAssignFaculty = async (payload) => {
    if (onUpdateChallenge) {
      await onUpdateChallenge(payload);
    } else {
      await universityApiService.assignFaculty(payload.challengeId, 'RU001', {
        name: payload.facultyName,
        department: payload.department
      });
    }
    await loadLiveDashboard();
  };

  const liveData = dashboardData || initialData;
  const liveChallenges = liveData?.challenges || [];
  const liveCount = liveData?.kpis?.assignedChallenges?.total || liveChallenges.length || 8;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">University Dashboard</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Welcome back, <span className="font-bold text-slate-900">{adminName} 👋</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Real-time innovation telemetry & district challenge dashboard for Ranchi University.
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
            if (act.actionType === 'review_challenges') {
              onNavigateTab && onNavigateTab('challenges');
            } else if (act.actionType === 'assign_faculty') {
              onNavigateTab && onNavigateTab('faculty');
            } else if (act.actionType === 'pending_approvals') {
              onNavigateTab && onNavigateTab('approvals');
            } else {
              onNavigateTab && onNavigateTab('challenges');
            }
          }}
          onViewAll={() => onNavigateTab && onNavigateTab('challenges')}
        />

        <UniversityRecentActivity
          activities={liveData?.recentActivity || liveData?.recentActivities || []}
          onViewAll={() => onNavigateTab && onNavigateTab('projects')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-start">
        <div className="lg:col-span-2">
          <UniversityAssignedChallenges
            challenges={liveChallenges}
            totalCount={liveCount}
            onActionClick={handleChallengeAction}
            onViewAll={() => onNavigateTab && onNavigateTab('challenges')}
          />
        </div>

        <div className="lg:col-span-1">
          <UniversityProjectProgress
            projectProgress={liveData?.projectProgress || liveData?.projectProgressBreakdown}
            topDomains={liveData?.topDomains || []}
          />
        </div>
      </div>

      <UniversityActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challenge={selectedChallenge}
        onAssignFaculty={handleAssignFaculty}
      />
    </div>
  );
};

export default UniversityDashboard;
