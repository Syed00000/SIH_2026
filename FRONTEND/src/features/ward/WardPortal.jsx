import React, { useState, useEffect } from 'react';
import { wardService } from '../government/services/wardService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import { WardHeader } from './components/WardHeader.jsx';
import { WardSidebar } from './components/WardSidebar.jsx';
import { WardOverviewPanel } from './components/WardOverviewPanel.jsx';
import { WardProblemsPanel } from './components/WardProblemsPanel.jsx';
import { WardProblemDetailModal } from './components/WardProblemDetailModal.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const WardPortal = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [ward, setWard] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const getTargetWardId = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryWardId = urlParams.get('wardId');
      if (queryWardId) return queryWardId;
    }
    return user?.wardId || user?.profile?.wardId || '';
  };

  const loadWardData = async () => {
    try {
      setLoading(true);
      const targetId = getTargetWardId();
      let currentWard = null;

      if (targetId) {
        currentWard = await wardService.getWardById(targetId);
      }
      if (!currentWard) {
        const allWards = await wardService.getWards();
        currentWard = allWards && allWards.length > 0 ? allWards[0] : null;
      }
      setWard(currentWard);

      const targetWardCode = currentWard?.wardId || targetId;
      const resChallenges = await citizenService.fetchChallenges({ limit: 150 });

      const allChls = resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || [];
      const wardChls = targetWardCode
        ? allChls.filter(
            (c) =>
              c.assignedWard?.wardId?.toUpperCase() === targetWardCode.toUpperCase() ||
              c.assignedWard?.id === targetWardCode ||
              c.assignedWard?.id === currentWard?._id
          )
        : allChls;

      setChallenges(wardChls);
    } catch (err) {
      console.warn('Error loading WardPortal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWardData();
  }, []);

  const handleChallengeUpdated = (updated) => {
    setChallenges((prev) =>
      prev.map((c) => ((c.challengeId || c._id) === (updated.challengeId || updated._id) ? updated : c))
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <WardOverviewPanel
            ward={ward}
            challenges={challenges}
            onNavigateTab={setActiveTab}
            onSelectChallenge={setSelectedChallenge}
          />
        );
      case 'problems':
        return (
          <WardProblemsPanel
            challenges={challenges}
            loading={loading}
            onSelectChallenge={setSelectedChallenge}
          />
        );
      default:
        return (
          <WardOverviewPanel
            ward={ward}
            challenges={challenges}
            onNavigateTab={setActiveTab}
            onSelectChallenge={setSelectedChallenge}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <WardHeader ward={ward} onLogout={onLogout} />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-slate-50">
        <WardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assignedCount={challenges.length}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 custom-scrollbar">
            <div className="max-w-6xl mx-auto w-full">{renderContent()}</div>
          </main>
          <GovernmentFooter />
        </div>
      </div>

      <WardProblemDetailModal
        isOpen={Boolean(selectedChallenge)}
        challenge={selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        onUpdated={handleChallengeUpdated}
      />
    </div>
  );
};

export default WardPortal;
