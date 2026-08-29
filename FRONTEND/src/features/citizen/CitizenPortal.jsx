import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { CitizenHeader } from './components/CitizenHeader.jsx';
import { CitizenHome } from './components/CitizenHome.jsx';
import { CitizenMyChallenges } from './components/CitizenMyChallenges.jsx';
import { CitizenUpdates } from './components/CitizenUpdates.jsx';
import { CitizenProfile } from './components/CitizenProfile.jsx';
import { SubmitChallengeModal } from './components/SubmitChallengeModal.jsx';
import { CitizenChallengeDetailModal } from './components/CitizenChallengeDetailModal.jsx';
import { citizenService } from './services/citizenService.js';

export const CitizenPortal = ({ user: propUser, onLogout }) => {
  const { user: authUser } = useAuth();
  const user = propUser || authUser;

  const [activeTab, setActiveTab] = useState('home');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col justify-between">
      <div>
        {/* Web Application Header */}
        <CitizenHeader
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onSubmitClick={handleOpenSubmit}
          unreadCount={unreadNotificationsCount}
          onNotificationsClick={() => {
            setActiveTab('updates');
            setUnreadNotificationsCount(0);
          }}
          user={user}
          onLogout={onLogout}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </div>

      {/* Web Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-700">Department of Higher and Technical Education</strong> — Government of Jharkhand
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-slate-900 cursor-pointer">Home</button>
            <button onClick={() => setActiveTab('challenges')} className="hover:text-slate-900 cursor-pointer">My Challenges</button>
            <button onClick={() => setActiveTab('updates')} className="hover:text-slate-900 cursor-pointer">Updates</button>
            <button onClick={() => setActiveTab('profile')} className="hover:text-slate-900 cursor-pointer">Profile</button>
          </div>
          <div>
            © {new Date().getFullYear()} Societal Innovation Hub. All rights reserved.
          </div>
        </div>
      </footer>

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
