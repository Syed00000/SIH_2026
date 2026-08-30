import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { NodalSidebar } from './components/NodalSidebar.jsx';
import { NodalHeader } from './components/NodalHeader.jsx';
import { NodalOverview } from './components/NodalOverview.jsx';
import { NodalChallenges } from './components/NodalChallenges.jsx';
import { NodalUniversitiesPanel } from './components/NodalUniversitiesPanel.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const NodalPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  const institutionName = user?.profile?.institutionName || 'Jharkhand State Innovation Cell';
  const nodalName = user?.fullName || 'State Nodal Officer';

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'dashboard':
        return (
          <NodalOverview
            onNavigateChallenges={() => setActiveTab('challenges')}
            onNavigateUniversities={() => setActiveTab('universities')}
          />
        );
      case 'universities':
        return (
          <NodalUniversitiesPanel
            onNavigateChallenges={() => setActiveTab('challenges')}
          />
        );
      case 'challenges':
      case 'assigned':
      case 'approvals':
        return <NodalChallenges />;
      default:
        return (
          <NodalOverview
            onNavigateChallenges={() => setActiveTab('challenges')}
            onNavigateUniversities={() => setActiveTab('universities')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row overflow-hidden h-screen text-slate-800 antialiased select-none">
      {/* 1. Left Nodal Sidebar */}
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

      {/* 2. Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        {/* Sticky Header with Real Institution & Officer Info */}
        <NodalHeader
          institutionName={institutionName}
          nodalName={nodalName}
          notificationCount={4}
          onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Scrollable Content */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>

        {/* Pinned Bottom Footer - always fixed cleanly at the bottom */}
        <GovernmentFooter />
      </div>
    </div>
  );
};

export default NodalPortal;
