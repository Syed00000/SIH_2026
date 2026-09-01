import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { CitizenHeader } from './components/CitizenHeader.jsx';
import { CitizenSidebar } from './components/CitizenSidebar.jsx';
import { CitizenHome } from './components/CitizenHome.jsx';
import { CitizenMyChallenges } from './components/CitizenMyChallenges.jsx';
import { CitizenProfile } from './components/CitizenProfile.jsx';
import { SubmitChallengeModal } from './components/SubmitChallengeModal.jsx';
import { CitizenChallengeDetailModal } from './components/CitizenChallengeDetailModal.jsx';
import { citizenService } from './services/citizenService.js';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { PortalSkeleton } from '../../shared/components/ui/PortalSkeleton.jsx';
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
  ChevronDown,
  HelpCircle
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

  const [activeDomainFilter, setActiveDomainFilter] = useState('All');
  const [stats, setStats] = useState(null);
  const [recentChallenge, setRecentChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGuideline, setExpandedGuideline] = useState(1);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, myChallRes, publicChallRes] = await Promise.all([
        citizenService.fetchStats(),
        citizenService.fetchMyChallenges(),
        citizenService.fetchChallenges({ limit: 1 })
      ]);

      const myChallenges = myChallRes.challenges || [];
      const computedActivities = {
        submitted: myChallenges.filter((c) => (c.status || '').toLowerCase() === 'submitted').length,
        underReview: myChallenges.filter((c) => (c.status || '').toLowerCase() === 'under review').length,
        inProgress: myChallenges.filter((c) => (c.status || '').toLowerCase() === 'in progress').length,
        resolved: myChallenges.filter((c) => (c.status || '').toLowerCase() === 'resolved').length,
        total: myChallenges.length
      };

      const finalStats = {
        activities: (statsData?.activities?.total > 0)
          ? statsData.activities
          : (myChallenges.length > 0 ? computedActivities : statsData?.activities || { submitted: 0, underReview: 0, inProgress: 0, resolved: 0, total: 0 }),
        overallImpact: statsData?.overallImpact || { challengesSubmitted: myChallenges.length || 2, universitiesEngaged: 86, industryPartners: 124 }
      };

      setStats(finalStats);

      if (myChallenges.length > 0) {
        setRecentChallenge(myChallenges[0]);
      } else if (publicChallRes.challenges && publicChallRes.challenges.length > 0) {
        setRecentChallenge(publicChallRes.challenges[0]);
      }
    } catch (err) {
      console.warn('Citizen data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSubmit = () => {
    setActiveTab('submit');
  };

  const handleChallengeSubmitted = (newChall) => {
    setRecentChallenge(newChall);
    loadData();
    setActiveTab('challenges');
    setActiveStatusFilter('All');
    setActiveDomainFilter('All');
  };

  const handleSelectArea = (areaName) => {
    setActiveDomainFilter(areaName || 'All');
    setActiveTab('challenges');
    setActiveStatusFilter('All');
  };

  const handleSelectStatus = (statusName) => {
    setActiveStatusFilter(statusName || 'All');
    setActiveDomainFilter('All');
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
    if (tileId === 'guidelines') {
      alert('Official Guidelines: Citizen problem statements are triaged by the State Innovation Cell and matched with HEI faculty labs within 7 business days.');
    } else if (tileId === 'help') {
      alert('Jharkhand Societal Innovation Citizen Helpline: 1800-345-6789 (Toll Free)');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white text-slate-800 font-sans select-none overflow-hidden">
      
      {/* 1. Desktop & Mobile Shared Header */}
      <CitizenHeader
        user={user}
        onLogout={onLogout}
        onSelectNotification={handleSelectChallenge}
        onMenuClick={() => setIsMobileDrawerOpen(true)}
      />

      {/* 2. Middle Body: Left Sidebar (Desktop) + Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
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
          isSubmitOpen={isSubmitModalOpen}
        />

        {/* Right Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white flex flex-col justify-between pb-20 md:pb-0">
          <div className="w-full max-w-[1600px] space-y-6">
            {isLoading ? (
              <PortalSkeleton />
            ) : (
              <>
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
                    setActiveStatusFilter={setActiveStatusFilter}
                    activeDomainFilter={activeDomainFilter}
                    setActiveDomainFilter={setActiveDomainFilter}
                    onSelectChallenge={handleSelectChallenge}
                    onSubmitClick={handleOpenSubmit}
                  />
                )}

                {activeTab === 'submit' && (
                  <SubmitChallengeModal
                    isOpen={true}
                    isInline={true}
                    user={user}
                    defaultDomain={activeDomainFilter !== 'All' ? activeDomainFilter : 'Urban Development'}
                    onClose={() => setActiveTab('home')}
                    onSuccess={handleChallengeSubmitted}
                  />
                )}



                {activeTab === 'profile' && (
                  <CitizenProfile user={user} stats={stats} onChangeTab={setActiveTab} />
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

                    <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs flex flex-col">
                      <GuidelineAccordionItem
                        title="1. Problem Submission Scope"
                        isOpen={expandedGuideline === 1}
                        onClick={() => setExpandedGuideline(expandedGuideline === 1 ? null : 1)}
                      >
                        File challenges related to public infrastructure, water sanitation, rural electrification, healthcare, education, or urban governance.
                      </GuidelineAccordionItem>

                      <GuidelineAccordionItem
                        title="2. Review & Triage Process"
                        isOpen={expandedGuideline === 2}
                        onClick={() => setExpandedGuideline(expandedGuideline === 2 ? null : 2)}
                      >
                        Each submission is screened within 48 hours and assigned a unique Reference Code (e.g., CHL-JH-2026-XXXX).
                      </GuidelineAccordionItem>

                      <GuidelineAccordionItem
                        title="3. Resolution & Tracking"
                        isOpen={expandedGuideline === 3}
                        onClick={() => setExpandedGuideline(expandedGuideline === 3 ? null : 3)}
                      >
                        Track faculty mentors and student teams working on solutions in real-time under 'My Challenges'.
                      </GuidelineAccordionItem>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Web Desktop Footer - naturally at bottom of document flow */}
          <div className="mt-12 hidden md:block -mx-4 sm:-mx-6">
            <GovernmentFooter />
          </div>
        </main>
      </div>

      {/* 3. Bottom Navigation Bar for Mobile Screens ONLY (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-1.5 flex z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 items-center justify-items-center w-full relative">
          {/* 1. Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-1 ${
              activeTab === 'home' ? 'text-[#047857]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>Home</span>
          </button>

          {/* 2. My Challenges Tab */}
          <button
            onClick={() => {
              setActiveTab('challenges');
              setActiveStatusFilter('All');
            }}
            className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-1 ${
              activeTab === 'challenges' ? 'text-[#047857]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className={`w-5 h-5 ${activeTab === 'challenges' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] ${activeTab === 'challenges' ? 'font-bold' : 'font-medium'}`}>Challenges</span>
          </button>

          {/* 3. Floating Center Green Submit Button */}
          <div className="flex flex-col items-center justify-center w-full h-full relative">
            <button
              onClick={handleOpenSubmit}
              className="absolute -top-7 w-12 h-12 rounded-full bg-gradient-to-tr from-[#064e3b] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white flex items-center justify-center shadow-lg border-3 border-white cursor-pointer active:scale-95 transition-transform"
              title="Submit a Challenge"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* 4. Help Tab */}
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-1 ${
              activeTab === 'guidelines' ? 'text-[#047857]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <HelpCircle className={`w-5 h-5 ${activeTab === 'guidelines' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] ${activeTab === 'guidelines' ? 'font-bold' : 'font-medium'}`}>Help</span>
          </button>

          {/* 5. Profile Tab */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center space-y-0.5 cursor-pointer w-full py-1 ${
              activeTab === 'profile' ? 'text-[#047857]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>Profile</span>
          </button>
        </div>
      </nav>

      {/* 4. Modals */}
      <CitizenChallengeDetailModal
        challenge={selectedChallenge}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onChallengeUpdated={loadData}
      />
    </div>
  );
};

const GuidelineAccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-t border-slate-100 first:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left space-x-2 py-3.5 outline-none cursor-pointer group"
      >
        <h4 className="text-xs font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors">{title}</h4>
        <ChevronDown className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40 opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
};

export default CitizenPortal;
