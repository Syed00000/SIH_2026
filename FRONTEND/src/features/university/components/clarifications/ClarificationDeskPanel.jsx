import React, { useState } from 'react';
import {
  MessageSquare,
  Shield,
  Phone,
  Mail,
  HelpCircle,
  CheckCircle2,
  Clock,
  Check,
  X,
  Search,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Send,
  Building,
  UserPlus
} from 'lucide-react';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';

export const ClarificationDeskPanel = ({
  challenges = [],
  universityCode = 'RU001',
  universityName = 'Ranchi University',
  onUpdateChallengeStatus,
  onAssignFaculty
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'CLARIFIED' | 'ACCEPTED'
  const [selectedChatChallenge, setSelectedChatChallenge] = useState(null);

  const filteredChallenges = challenges.filter((c) => {
    const queryMatch =
      !searchTerm ||
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.challengeId || c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.domain || '').toLowerCase().includes(searchTerm.toLowerCase());

    const hasQuery = c.clarificationQuery || c.assignedUniversity?.clarificationQuery;
    const isClarified = c.clarificationResponse || c.status === 'Clarified';
    const isAccepted = c.assignedUniversity?.acceptanceStatus === 'Accepted' || c.status === 'In Progress';

    if (statusFilter === 'ACTIVE') return queryMatch && hasQuery && !isClarified;
    if (statusFilter === 'CLARIFIED') return queryMatch && isClarified && !isAccepted;
    if (statusFilter === 'ACCEPTED') return queryMatch && isAccepted;
    return queryMatch;
  });

  return (
    <div className="space-y-4 select-none animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 rounded-2xl text-white shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-300">
                Live State Intercom Hub
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Nodal Clarification & Socket.IO Desk
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              Real-time 2-way communication channel between <strong>{universityName}</strong> and the State Nodal Officer desk. Discuss telemetry, GPS boundaries, and lab validations before accepting challenges.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Total Allocations</span>
              <span className="text-lg font-black text-white">{challenges.length}</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-400/30 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Active Rooms</span>
              <span className="text-lg font-black text-emerald-300">
                {challenges.filter((c) => c.clarificationQuery || c.clarificationResponse).length || challenges.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems, Nodal officers, or domains..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          {[
            { id: 'ALL', label: 'All Discussions' },
            { id: 'ACTIVE', label: 'Active Queries' },
            { id: 'CLARIFIED', label: 'Clarified • Ready' },
            { id: 'ACCEPTED', label: 'In R&D' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-[#007A61] shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Challenge Clarification Cards Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-sm font-extrabold text-slate-700">No Clarification Threads Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filter or inspect assigned challenges to initiate a new clarification room.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.map((ch) => {
            const chlId = ch.challengeId || ch.id || 'CHL-JH-2026';
            const nodalOfficer = ch.allocatedBy || ch.nodalOfficer || {};
            const nodalName = 'State Nodal Officer';
            const nodalPhone = nodalOfficer.phone || '+91 9876543210';
            const nodalEmail = 'nodal@joharsetu.gov.in';
            const nodalDept = 'Dept. of Higher & Technical Education, Govt. of Jharkhand';

            const hasQuery = ch.clarificationQuery || ch.assignedUniversity?.clarificationQuery;
            const hasResponse = ch.clarificationResponse;
            const isAccepted = ch.assignedUniversity?.acceptanceStatus === 'Accepted' || ch.status === 'In Progress';
            const isDeclined = ch.assignedUniversity?.acceptanceStatus === 'Declined' || ch.status === 'Rejected';

            return (
              <div
                key={chlId}
                className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3.5 group"
              >
                {/* Header Row: ID, Priority, Nodal Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-xs text-[#007A61] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {chlId}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {ch.domain || 'Field Challenge'}
                    </span>
                  </div>

                  {/* Clarification State Badge */}
                  {isAccepted ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <Check className="w-3 h-3 text-[#007A61]" />
                      <span>Accepted for R&D</span>
                    </span>
                  ) : isDeclined ? (
                    <span className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      Declined
                    </span>
                  ) : hasResponse ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Clarified • Ready</span>
                    </span>
                  ) : hasQuery ? (
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse">
                      Query Under Review
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      Room Ready
                    </span>
                  )}
                </div>

                {/* Problem Title & Brief Statement */}
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#007A61] transition-colors leading-snug">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{ch.problemStatement || ch.description}"
                  </p>
                </div>

                {/* Assigned State Nodal Officer Info Card */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#007A61] text-white flex items-center justify-center font-black text-xs shadow-2xs">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                        <span>{nodalName}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-medium">
                        State Nodal Officer &bull; {nodalDept}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${nodalPhone}`}
                    className="p-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 rounded-lg shadow-2xs transition-colors"
                    title={`Call ${nodalPhone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Clarification Thread Snippet */}
                {hasQuery && (
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs space-y-1 text-amber-950">
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-amber-800">
                      <span>Latest Clarification Inquiry:</span>
                      <span className="font-mono">Active</span>
                    </div>
                    <p className="italic text-[11px]">
                      "{ch.clarificationQuery || ch.assignedUniversity?.clarificationQuery}"
                    </p>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ch.location?.district || ch.district || 'Jharkhand'}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Live Clarification Chat Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedChatChallenge(ch)}
                      className="px-3.5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>💬 Open Live Chat Room</span>
                    </button>

                    {/* Quick Accept if clarified and not yet accepted */}
                    {!isAccepted && onUpdateChallengeStatus && (
                      <button
                        type="button"
                        onClick={() => onUpdateChallengeStatus(chlId, 'Accepted', 'Accepted by HEI')}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real-time Socket.IO Clarification Chat Dialog */}
      {selectedChatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(selectedChatChallenge)}
          onClose={() => setSelectedChatChallenge(null)}
          challenge={selectedChatChallenge}
          isUniversityView={true}
          onAcceptChallenge={(c) => {
            setSelectedChatChallenge(null);
            if (onUpdateChallengeStatus) {
              onUpdateChallengeStatus(c.challengeId || c.id, 'Accepted', 'Accepted by HEI');
            }
          }}
          onDeclineChallenge={(c) => {
            setSelectedChatChallenge(null);
            if (onUpdateChallengeStatus) {
              onUpdateChallengeStatus(c.challengeId || c.id, 'Declined', 'Declined by HEI');
            }
          }}
        />
      )}
    </div>
  );
};

export default ClarificationDeskPanel;
