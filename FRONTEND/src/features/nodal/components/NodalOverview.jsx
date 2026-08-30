import React, { useState, useEffect } from 'react';
import { NodalStatCards } from './NodalStatCards.jsx';
import { citizenService } from '../../citizen/services/citizenService.js';
import { universityService } from '../../government/services/universityService.js';
import {
  Layers,
  Building,
  CheckCircle2,
  ArrowRight,
  Clock,
  Send,
  ShieldCheck,
  MapPin,
  User,
  GraduationCap,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { NodalAssignModal } from './NodalAssignModal.jsx';

export const NodalOverview = ({ onNavigateChallenges, onNavigateUniversities }) => {
  const [stats, setStats] = useState({ submitted: 0, underReview: 0, inProgress: 0, resolved: 0, total: 0 });
  const [allChallenges, setAllChallenges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, challengesRes, unisRes] = await Promise.all([
        citizenService.fetchStats(),
        citizenService.fetchChallenges({ limit: 100 }),
        universityService.getUniversities({ limit: 100 })
      ]);

      const challengesList =
        challengesRes?.challenges || (Array.isArray(challengesRes) ? challengesRes : []) || [];
      const unisList = unisRes?.records || [];

      setAllChallenges(challengesList);
      setUniversities(unisList);

      // Compute exact live statistics from active database records
      const total = challengesList.length;
      const underReview = challengesList.filter(
        (c) => c.status === 'Submitted' || c.status === 'Under Review' || !c.assignedUniversity?.id
      ).length;
      const inProgress = challengesList.filter(
        (c) => c.status === 'In Progress' || Boolean(c.assignedUniversity?.id)
      ).length;
      const resolved = challengesList.filter((c) => c.status === 'Resolved').length;

      setStats({
        total: total || statsRes?.activities?.total || 0,
        underReview: underReview || statsRes?.activities?.underReview || statsRes?.activities?.submitted || 0,
        inProgress: inProgress || statsRes?.activities?.inProgress || 0,
        resolved: resolved || statsRes?.activities?.resolved || 0
      });
    } catch (err) {
      console.warn('Error loading nodal dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenTriage = (chl) => {
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleTriageSuccess = () => {
    loadData();
  };

  return (
    <div className="space-y-3.5 select-none text-left pb-4 animate-in fade-in duration-150">
      {/* 1. Executive Nodal Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#047857] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              State Nodal Authority
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-semibold text-slate-500">Higher & Technical Education</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Grassroots Problem Triage & HEI Allocation Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor real-time citizen problem ingestion, evaluate scope, and allocate R&D mandates across Jharkhand universities.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onNavigateUniversities}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-200/90 shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#047857]" />
            <span>HEI Directory ({universities.length})</span>
          </button>

          <button
            onClick={onNavigateChallenges}
            className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
          >
            <span>Triage Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Sleek Stat Cards with Live Numbers */}
      <NodalStatCards
        stats={stats}
        onCardClick={(tab) => {
          if (tab === 'assigned') {
            if (onNavigateUniversities) onNavigateUniversities();
          } else if (onNavigateChallenges) {
            onNavigateChallenges();
          }
        }}
      />

      {/* 3. Main Operational Panels: Live Ingestion Feed & University Node Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left Column (2 Cols): Live Citizen Ground Challenges */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#047857]" />
                <span>Recent Citizen Ground Submissions</span>
              </h3>
              <p className="text-[11px] text-slate-500">Live problem statements awaiting Nodal screening and HEI allocation</p>
            </div>
            <button
              onClick={onNavigateChallenges}
              className="text-xs font-bold text-[#047857] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>View All ({allChallenges.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {allChallenges.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400 space-y-2">
                <Layers className="w-6 h-6 mx-auto text-slate-300" />
                <p>No citizen submissions pending review in database.</p>
              </div>
            ) : (
              allChallenges.slice(0, 5).map((c) => {
                const id = c.challengeId || c.id;
                const assignedUni = c.assignedUniversity || {};
                const isAssigned = Boolean(assignedUni.id || assignedUni.name);
                const formattedDate = c.submittedAt
                  ? new Date(c.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  : 'Recent';

                return (
                  <div
                    key={id}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-[11px]">
                          {id}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {c.domain || 'Infrastructure'}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{c.location?.district || c.district || 'Ranchi'}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {c.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{c.description || c.problemStatement}"
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5 font-medium">
                        <span>Submitter: <strong className="text-slate-700">{c.submitter?.name || c.submittedBy || 'Citizen'}</strong></span>
                        <span>&bull;</span>
                        <span>Filed: {formattedDate}</span>
                        {isAssigned && (
                          <>
                            <span>&bull;</span>
                            <span className="text-emerald-800 font-bold">Assigned to {assignedUni.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleOpenTriage(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5 ${
                          isAssigned
                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-800'
                            : 'bg-[#047857] hover:bg-[#064e3b] text-white'
                        }`}
                      >
                        {isAssigned ? <RotateCcw className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                        <span>{isAssigned ? 'Reassign' : 'Triage & Allocate'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Higher Education Institutions Directory */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#047857]" />
                <span>Jharkhand HEI Nodes</span>
              </h3>
              <p className="text-[11px] text-slate-500">Active university research centers in state</p>
            </div>
            <button
              onClick={onNavigateUniversities}
              className="text-xs font-bold text-[#047857] hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {universities.slice(0, 6).map((uni) => {
              const code = uni.code || uni.aisheCode;
              const assignedCount = allChallenges.filter(
                (c) => c.assignedUniversity?.id?.toUpperCase() === code?.toUpperCase()
              ).length;

              return (
                <div
                  key={code}
                  onClick={onNavigateUniversities}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/80 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10.5px] font-bold text-slate-500">{code}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[10.5px] text-slate-500 font-medium">{uni.district || 'Jharkhand'}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{uni.name}</h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                      assignedCount > 0
                        ? 'bg-emerald-50 text-[#064e3b] border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {assignedCount} {assignedCount === 1 ? 'Problem' : 'Problems'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Triage & Allocation Modal */}
      <NodalAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        challenge={selectedChallenge}
        onSuccess={handleTriageSuccess}
      />
    </div>
  );
};

export default NodalOverview;
