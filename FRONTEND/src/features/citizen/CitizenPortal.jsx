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
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import {
  Bell,
  LogOut,
  X,
  Menu,
  Plus,
  Home,
  FileText,
  MessageSquare,
  User,
  ChevronDown
} from 'lucide-react';

export const CitizenPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('home');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isChallengesDropdownOpen, setIsChallengesDropdownOpen] = useState(true);

  const [stats, setStats] = useState(null);
  const [recentChallenge, setRecentChallenge] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

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
      alert('Jharkhand Societal Innovation Citizen Helpline: 1800-345-6789 (Toll Free)');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] text-slate-800 font-sans select-none overflow-x-hidden">
      
      {/* 1. Desktop & Mobile Shared Header */}
      <CitizenHeader
        unreadCount={unreadNotificationsCount}
        onNotificationsClick={() => {
          setActiveTab('updates');
          setUnreadNotificationsCount(0);
        }}
        user={user}
        onLogout={onLogout}
        onMenuClick={() => setIsMobileDrawerOpen(true)}
      />

      {/* 2. Middle Body: Left Sidebar (Desktop) + Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Desktop Sidebar Navigation */}
        <CitizenSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSubmitClick={handleOpenSubmit}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileDrawerOpen}
          setIsMobileMenuOpen={setIsMobileDrawerOpen}
          onLogout={onLogout}
        />

        {/* Right Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc] flex flex-col justify-between pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto w-full space-y-6">
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
              <CitizenProfile user={user} onChangeTab={setActiveTab} />
            )}

            {activeTab === 'guidelines' && (
              <div className="space-y-4 text-left animate-fadeIn">
                <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Citizen Guidelines & Innovation Directives
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Jharkhand Societal Innovation Hub directly connects citizen problem statements with university R&D nodes and government nodal officers.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-800">1. Problem Submission Scope</h4>
                    <p className="text-xs text-slate-600">
                      File challenges related to public infrastructure, water sanitation, rural electrification, healthcare, education, or urban governance.
                    </p>
                  </div>
                  <div className="space-y-1 border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-emerald-800">2. Review & Triage Process</h4>
                    <p className="text-xs text-slate-600">
                      Each submission is screened within 48 hours and assigned a unique Reference Code (e.g., CHL-JH-2026-XXXX).
                    </p>
                  </div>
                  <div className="space-y-1 border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-emerald-800">3. Resolution & Tracking</h4>
                    <p className="text-xs text-slate-600">
                      Track faculty mentors and student teams working on solutions in real-time under 'My Challenges'.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Web Desktop Footer */}
          <div className="mt-8 hidden md:block">
            <GovernmentFooter />
          </div>
        </main>
      </div>

      {/* 3. Bottom Navigation Bar for Mobile Screens ONLY (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between z-40 shadow-lg">
        {/* Home Tab */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
            activeTab === 'home' ? 'text-[#047857] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* My Challenges Tab */}
        <button
          onClick={() => {
            setActiveTab('challenges');
            setActiveStatusFilter('All');
          }}
          className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
            activeTab === 'challenges' ? 'text-[#047857] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">My Challenges</span>
        </button>

        {/* Floating Center Green Submit Button */}
        <button
          onClick={handleOpenSubmit}
          className="w-12 h-12 rounded-full bg-[#047857] hover:bg-[#064e3b] text-white flex items-center justify-center shadow-lg transform -translate-y-3 border-4 border-white cursor-pointer active:scale-95 transition-transform"
          title="Submit a Challenge"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Portal Updates Tab */}
        <button
          onClick={() => setActiveTab('updates')}
          className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
            activeTab === 'updates' ? 'text-[#047857] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Updates</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
            activeTab === 'profile' ? 'text-[#047857] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* 4. Modals */}
      <SubmitChallengeModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        user={user}
        onSuccess={handleChallengeSubmitted}
      />

      <CitizenChallengeDetailModal
        challenge={selectedChallenge}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default CitizenPortal;
