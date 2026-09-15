import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { NodalSidebar } from './components/NodalSidebar.jsx';
import { NodalHeader } from './components/NodalHeader.jsx';
import { NodalOverview } from './components/NodalOverview.jsx';
import { NodalChallenges } from './components/NodalChallenges.jsx';
import { NodalUniversitiesPanel } from './components/NodalUniversitiesPanel.jsx';
import { StateDirectory } from './components/state-directory/index.js';
import { DistrictDirectory } from './components/district-directory/index.js';
import { BlockDirectory } from './components/block-directory/index.js';
import { WardDirectory } from './components/ward-directory/index.js';
import { NodalProfilePanel } from './components/profile/NodalProfilePanel.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const NodalPortal = ({ user: propUser, onLogout, onNavigate }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const nodalDistrict = user?.district || user?.profile?.district || user?.profile?.location?.district || '';
  const institutionName = user?.profile?.institutionName || 'Jharkhand State Innovation Cell';
  const nodalName = user?.fullName || 'State Nodal Officer';

  const [challengeFilter, setChallengeFilter] = useState('All Status');

  const handleNavigateChallenges = (filter = 'All Status') => {
    const safeFilter = typeof filter === 'string' ? filter : 'All Status';
    setChallengeFilter(safeFilter);
    setActiveTab('challenges');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'dashboard':
        return (
          <NodalOverview
            onNavigateChallenges={handleNavigateChallenges}
            onNavigateUniversities={() => setActiveTab('universities')}
            nodalDistrict={nodalDistrict}
          />
        );
      case 'universities':
        return (
          <NodalUniversitiesPanel
            onNavigateChallenges={handleNavigateChallenges}
          />
        );
      case 'challenges':
      case 'assigned':
      case 'approvals':
        return <NodalChallenges initialStatusFilter={challengeFilter} nodalDistrict={nodalDistrict} />;
      case 'state-directory':
        return <StateDirectory nodalDistrict={nodalDistrict} user={user} onNavigate={onNavigate} />;
      case 'district-directory':
        return <DistrictDirectory nodalDistrict={nodalDistrict} user={user} onNavigate={onNavigate} />;
      case 'block-directory':
      case 'local-bodies':
        return <BlockDirectory nodalDistrict={nodalDistrict} user={user} onNavigate={onNavigate} />;
      case 'ward-directory':
        return <WardDirectory nodalDistrict={nodalDistrict} user={user} onNavigate={onNavigate} />;
      case 'profile':
        return (
          <NodalProfilePanel
            user={user}
            onLogout={onLogout}
            onNavigateChallenges={handleNavigateChallenges}
            onNavigateUniversities={() => setActiveTab('universities')}
          />
        );
      default:
        return (
          <NodalOverview
            onNavigateChallenges={handleNavigateChallenges}
            onNavigateUniversities={() => setActiveTab('universities')}
            nodalDistrict={nodalDistrict}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <NodalHeader
        institutionName={institutionName}
        nodalName={nodalName}
        nodalDistrict={nodalDistrict}
        user={user}
        notificationCount={4}
        onSelectNotification={() => handleNavigateChallenges('All Status')}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-white">
        <NodalSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
          institutionName={institutionName}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
          </main>
          <GovernmentFooter />
        </div>
      </div>
    </div>
  );
};

export default NodalPortal;
