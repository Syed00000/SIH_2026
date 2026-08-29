import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { CitizenHeader } from './components/CitizenHeader.jsx';
import { CitizenSidebar } from './components/CitizenSidebar.jsx';
import { CitizenHome } from './components/CitizenHome.jsx';
import { CitizenMyChallenges } from './components/CitizenMyChallenges.jsx';
import { CitizenUpdates } from './components/CitizenUpdates.jsx';
import { CitizenProfile } from './components/CitizenProfile.jsx';
import { SubmitChallengeModal } from './components/SubmitChallengeModal.jsx';
import { CitizenChallengeDetailModal } from './components/CitizenChallengeDetailModal.jsx';
import { citizenService } from './services/citizenService.js';
import { exportGenericReportPdf } from '../government/services/exportPdfService.js';

export const CitizenPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('home');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('Ranchi');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [recentChallenge, setRecentChallenge] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);

  const loadData = async () => {
    try {
      const [statsData, challengesRes] = await Promise.all([
        citizenService.fetchStats(),
        citizenService.fetchChallenges({ limit: 1 })
      ]);
      setStats(statsData);
      if (challengesRes.challenges && challengesRes.challenges.length > 0) {
        setRecentChallenge(challengesRes.challenges[0]);
      }
    } catch (err) {
      console.warn('Citizen data fetch error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleChallengeSubmitted = (newChall) => {
    setRecentChallenge(newChall);
    loadData();
    setActiveTab('challenges');
    setActiveStatusFilter('All');
  };

  const handleSelectArea = (areaName) => {
    setActiveTab('challenges');
    setActiveStatusFilter('All');
  };

  const handleSelectStatus = (statusName) => {
    setActiveStatusFilter(statusName);
    setActiveTab('challenges');
  };

  const handleViewAllChallenges = () => {
    setActiveStatusFilter('All');
    setActiveTab('challenges');
  };

  const handleSelectChallenge = (chall) => {
    setSelectedChallenge(chall);
    setIsDetailModalOpen(true);
  };

  const handleSelectStayUpdatedTile = (tileId) => {
    if (tileId === 'notifications' || tileId === 'messages') {
      setActiveTab('updates');
    } else if (tileId === 'guidelines') {
      alert('Official Guidelines: Citizen problem statements are triaged by the State Innovation Cell and matched with HEI faculty labs within 7 business days.');
    } else if (tileId === 'help') {
      alert('Jharkhand Societal Innovation Citizen Helpline: 1800-345-6789 (Toll Free) | citizen.support@joharsetu.gov.in');
    }
  };

  const handleExportPdf = () => {
    exportGenericReportPdf({
      title: 'Jharkhand Citizen Portal Summary',
      subtitle: `District: ${selectedDistrict} | Sector: ${selectedSector}`,
      data: [
        { Parameter: 'Portal User', Value: user?.fullName || 'Citizen User' },
        { Parameter: 'Mobile Number', Value: user?.mobileNumber || 'N/A' },
        { Parameter: 'Email ID', Value: user?.email || 'N/A' },
        { Parameter: 'Active Submissions', Value: stats?.activities?.submitted || 0 },
        { Parameter: 'Under Review', Value: stats?.activities?.underReview || 0 },
        { Parameter: 'In Progress R&D', Value: stats?.activities?.inProgress || 0 },
        { Parameter: 'Resolved Impact', Value: stats?.activities?.resolved || 0 }
      ]
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans overflow-hidden select-none">
      {/* 1. Top Header Navbar (Emblem, Title, Filters, Bell, User Avatar) */}
      <CitizenHeader
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onExportPdf={handleExportPdf}
        unreadCount={unreadNotificationsCount}
        onNotificationsClick={() => {
          setActiveTab('updates');
          setUnreadNotificationsCount(0);
        }}
        onSubmitClick={handleOpenSubmit}
        user={user}
        onLogout={onLogout}
      />

      {/* 2. Middle Body: Left Sidebar + Main Content Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Navigation */}
        <CitizenSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSubmitClick={handleOpenSubmit}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
        />

        {/* Right Main Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc] flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'home' && (
              <CitizenHome
                stats={stats}
                recentChallenge={recentChallenge}
                onSubmitClick={handleOpenSubmit}
                onSelectArea={handleSelectArea}
                onSelectStatus={handleSelectStatus}
                onViewAllChallenges={handleViewAllChallenges}
                onSelectChallenge={handleSelectChallenge}
                onSelectStayUpdatedTile={handleSelectStayUpdatedTile}
              />
            )}

            {(activeTab === 'challenges' || activeTab === 'challenges_all' || activeTab === 'challenges_review' || activeTab === 'challenges_progress') && (
              <CitizenMyChallenges
                activeStatusFilter={activeStatusFilter}
                onSelectChallenge={handleSelectChallenge}
                onSubmitClick={handleOpenSubmit}
              />
            )}

            {activeTab === 'updates' && (
              <CitizenUpdates onSelectChallenge={handleSelectChallenge} />
            )}

            {activeTab === 'profile' && (
              <CitizenProfile
                user={user}
                onChangeTab={setActiveTab}
                onLogout={onLogout}
              />
            )}

            {activeTab === 'guidelines' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
                <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
                  Citizen Portal Guidelines & Help Desk
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The JoharSetu Citizen Portal empowers residents across all 24 districts of Jharkhand to report grassroots infrastructure, agricultural, environmental, and public service problems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                    <strong className="font-bold block text-emerald-900">Triage & Verification Protocol:</strong>
                    <span>Submitted challenges are AI-triaged and assigned to designated Nodal Universities within 48 hours.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs space-y-1">
                    <strong className="font-bold block text-blue-900">Toll-Free Helpline:</strong>
                    <span>Call 1800-345-6789 or email citizen.support@joharsetu.gov.in for immediate assistance.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Official Web Footer */}
          <footer className="mt-8 border-t border-slate-200 pt-4 pb-2 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[11px] font-medium">
              © {new Date().getFullYear()} Government of Jharkhand. Department of Higher & Technical Education. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-[11px] font-semibold text-slate-600">
              <button onClick={() => setActiveTab('home')} className="hover:text-slate-900 cursor-pointer">Overview</button>
              <button onClick={() => setActiveTab('challenges')} className="hover:text-slate-900 cursor-pointer">My Challenges</button>
              <button onClick={() => setActiveTab('guidelines')} className="hover:text-slate-900 cursor-pointer">Guidelines</button>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <SubmitChallengeModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        user={user}
        onSuccess={handleChallengeSubmitted}
      />

      <CitizenChallengeDetailModal
        isOpen={isDetailModalOpen}
        challenge={selectedChallenge}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedChallenge(null);
        }}
      />
    </div>
  );
};

export default CitizenPortal;
