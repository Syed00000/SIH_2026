import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { NodalSidebar } from './components/NodalSidebar.jsx';
import { NodalHeader } from './components/NodalHeader.jsx';
import { NodalOverview } from './components/NodalOverview.jsx';
import { NodalChallenges } from './components/NodalChallenges.jsx';

export const NodalPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  const institutionName = user?.profile?.institutionName || 'Ranchi University';
  const nodalName = user?.fullName || 'Nodal Officer';
  const rawCode = user?.profile?.aisheCode || user?.profile?.universityCode || user?.email || 'RU001';
  const universityCode = rawCode.includes('@') ? 'RU001' : rawCode;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'dashboard':
        return <NodalOverview onNavigateChallenges={() => setActiveTab('challenges')} />;
      case 'challenges':
        return <NodalChallenges universityCode={universityCode} />;
      default:
        return <NodalOverview onNavigateChallenges={() => setActiveTab('challenges')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/40 flex flex-row overflow-hidden h-screen text-slate-800 antialiased">
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
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          notificationCount={1}
          onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Scrollable Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>

          <footer className="w-full py-4 text-center text-slate-500 text-xs font-medium border-t border-slate-200/80 bg-slate-50/50 mt-6">
            <p>© 2026 Government of Jharkhand. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default NodalPortal;
