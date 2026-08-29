import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { CitizenHeader } from './components/CitizenHeader.jsx';
import { CitizenHome } from './components/CitizenHome.jsx';
import { CitizenMyChallenges } from './components/CitizenMyChallenges.jsx';
import { CitizenUpdates } from './components/CitizenUpdates.jsx';
import { CitizenProfile } from './components/CitizenProfile.jsx';
import { CitizenBottomNav } from './components/CitizenBottomNav.jsx';
import { SubmitChallengeModal } from './components/SubmitChallengeModal.jsx';
import { CitizenChallengeDetailModal } from './components/CitizenChallengeDetailModal.jsx';
import { citizenService } from './services/citizenService.js';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

export const CitizenPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('home');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(true);

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
    // Navigate to challenges tab to see the newly submitted challenge
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-0 sm:py-6 text-slate-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Desktop Mode Toggle Bar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 mb-2 text-xs font-semibold text-slate-500">
        <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Jharkhand Citizen Portal</span>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            onClick={() => setIsMobileFrameMode(true)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
              isMobileFrameMode
                ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device</span>
          </button>
          <button
            onClick={() => setIsMobileFrameMode(false)}
            className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all cursor-pointer ${
              !isMobileFrameMode
                ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Fluid View</span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Frame */}
      <div
        className={`w-full bg-[#f8fafc] transition-all duration-300 relative flex flex-col ${
          isMobileFrameMode
            ? 'max-w-[430px] min-h-[880px] sm:rounded-[40px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] sm:border-[10px] sm:border-slate-900 sm:ring-1 sm:ring-slate-800/10 overflow-hidden'
            : 'max-w-3xl rounded-2xl shadow-lg border border-slate-200 overflow-hidden'
        }`}
      >
        {/* Mobile Device Notch on Mobile Frame Mode */}
        {isMobileFrameMode && (
          <div className="hidden sm:flex justify-between items-center px-6 pt-2 text-[10px] font-bold text-slate-800 bg-white z-40">
            <span>9:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center space-x-1">
              <span className="text-[9px]">5G</span>
              <div className="w-4 h-2.5 border border-slate-700 rounded-xs p-0.5">
                <div className="w-full h-full bg-slate-800" />
              </div>
            </div>
          </div>
        )}

        {/* 1. Sticky Header with Emblem, Portal Title & Notification Badge */}
        <CitizenHeader
          unreadCount={unreadNotificationsCount}
          onNotificationsClick={() => {
            setActiveTab('updates');
            setUnreadNotificationsCount(0);
          }}
        />

        {/* 2. Main Scrollable Viewport */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto min-h-[500px]">
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

          {activeTab === 'challenges' && (
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
        </main>

        {/* 3. Fixed Bottom Navigation Bar */}
        <CitizenBottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onSubmitClick={handleOpenSubmit}
        />
      </div>

      {/* 4. Modals */}
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
