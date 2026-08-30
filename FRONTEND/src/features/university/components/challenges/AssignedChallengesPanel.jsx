import React, { useState, useEffect } from 'react';
import { ChallengesFilterBar } from './ChallengesFilterBar.jsx';
import { ChallengesTable } from './ChallengesTable.jsx';
import { ChallengeInspector } from './ChallengeInspector.jsx';
import { ChallengeActionModal } from './ChallengeActionModal.jsx';
import { ProblemEvidenceDossierModal } from '../../../nodal/components/ProblemEvidenceDossierModal.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const AssignedChallengesPanel = ({
  challenges: initialChallenges = [],
  universityCode = 'RU001',
  onUpdateChallengeStatus,
  onAssignFaculty
}) => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [dateRange, setDateRange] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [challengeList, setChallengeList] = useState(initialChallenges);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [dossierChallenge, setDossierChallenge] = useState(null);
  const [chatChallenge, setChatChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'accept', challenge: null });

  const fetchChallenges = async () => {
    setLoading(true);
    const data = await universityApiService.getAssignedChallenges(universityCode);
    const list = data?.challenges || (Array.isArray(data) ? data : []);
    if (list.length > 0) {
      setChallengeList(list);
    } else if (initialChallenges.length > 0) {
      setChallengeList(initialChallenges);
    } else {
      setChallengeList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, [universityCode]);

  useEffect(() => {
    if (initialChallenges && initialChallenges.length > 0) {
      setChallengeList(initialChallenges);
    }
  }, [initialChallenges]);

  const getNormalizedStatus = (challenge) => {
    if (!challenge) return 'Pending';
    const status = challenge.status;
    const acceptance = challenge.acceptanceStatus || challenge.assignedUniversity?.acceptanceStatus;
    const s = String(status || '').toLowerCase();
    const acc = String(acceptance || '').toLowerCase();
    if (s.includes('accept') || acc === 'accepted' || s === 'completed') return 'Accepted';
    if (s.includes('reject') || s.includes('decline') || acc === 'declined') return 'Rejected';
    if (s === 'clarified' || acc === 'clarified' || Boolean(challenge.clarificationResponse)) return 'Clarified';
    if (s.includes('clarif') || acc.includes('clarif') || Boolean(challenge.clarificationQuery)) return 'Clarification Requested';
    return 'Pending';
  };

  const filtered = challengeList.filter((c) => {
    if (statusFilter !== 'All Status' && getNormalizedStatus(c) !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && c.domain !== domainFilter) return false;
    if (districtFilter !== 'All Districts' && c.district !== districtFilter) return false;
    if (priorityFilter !== 'All Priority' && c.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const id = c.id || c.challengeId || '';
      return c.title.toLowerCase().includes(q) || id.toLowerCase().includes(q) || (c.district || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenModal = (type, challenge) => {
    setModalConfig({ isOpen: true, type, challenge });
  };

  const handleDirectAccept = (challenge) => {
    handleOpenModal('accept', challenge);
  };

  const handleDirectDecline = (challenge) => {
    handleOpenModal('decline', challenge);
  };

  const handleModalSubmit = async (payload) => {
    const { type, challengeId, reason, remarks, query } = payload;
    let newStatus = type === 'decline' || type === 'reject'
      ? 'Rejected'
      : type === 'clarify'
      ? 'Clarification Requested'
      : 'Accepted';
    let accStatus = type === 'decline' || type === 'reject'
      ? 'Declined'
      : type === 'clarify'
      ? 'Clarification Requested'
      : 'Accepted';
    let actionText = type === 'clarify' ? 'Clarification Active' : 'View';

    if (type === 'assign') {
      if (onAssignFaculty) {
        await onAssignFaculty({ challengeId, facultyName: payload.facultyName, department: payload.department });
      } else {
        await universityApiService.assignFaculty(challengeId, universityCode, {
          name: payload.facultyName,
          department: payload.department
        });
      }
    } else {
      const metadata = { declineReason: reason, remarks, query: query || remarks };
      if (onUpdateChallengeStatus) {
        await onUpdateChallengeStatus(challengeId, newStatus, actionText, metadata);
      } else {
        await universityApiService.updateChallengeStatus(challengeId, universityCode, newStatus, actionText, metadata);
      }
    }

    setSelectedChallenge((prev) => (prev && (prev.id === challengeId || prev.challengeId === challengeId) ? {
      ...prev,
      status: newStatus,
      acceptanceStatus: accStatus,
      declineReason: reason,
      clarificationQuery: query || remarks,
      actionText,
      actionLabel: actionText
    } : prev));
    setChallengeList((prev) => prev.map((c) => (c.id === challengeId || c.challengeId === challengeId ? {
      ...c,
      status: newStatus,
      acceptanceStatus: accStatus,
      declineReason: reason,
      clarificationQuery: query || remarks,
      actionText,
      actionLabel: actionText
    } : c)));
    await fetchChallenges();
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
              Live Database Allocations
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Assigned Citizen Challenges
          </h1>
          <p className="text-xs text-slate-500">
            Official problems allocated to this university by the Government of Jharkhand State Nodal Cell.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>Allocated Total:</span>
          <span className="font-mono text-emerald-700 font-extrabold text-sm">{challengeList.length}</span>
        </div>
      </div>

      <ChallengesFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="w-full">
        <ChallengesTable
          challenges={filtered}
          selectedChallengeId={selectedChallenge?.id || selectedChallenge?.challengeId || dossierChallenge?.id || dossierChallenge?.challengeId}
          onSelectChallenge={(c) => setDossierChallenge(c)}
          onActionClick={(c) => setDossierChallenge(c)}
          onAcceptChallenge={handleDirectAccept}
          onDeclineChallenge={handleDirectDecline}
          onViewDossier={(c) => setDossierChallenge(c)}
          onOpenChat={(c) => setChatChallenge(c)}
          totalCount={challengeList.length}
          loading={loading}
        />
      </div>

      {/* Official Evidence & Dossier Modal (Exact Admin/Nodal layout) with University Actions */}
      {dossierChallenge && (
        <ProblemEvidenceDossierModal
          challenge={dossierChallenge}
          isOpen={Boolean(dossierChallenge)}
          onClose={() => setDossierChallenge(null)}
          isUniversityView={true}
          onAccept={(c) => handleOpenModal('accept', c)}
          onRequestClarification={(c) => setChatChallenge(c)}
          onOpenChat={(c) => setChatChallenge(c)}
          onDecline={(c) => handleOpenModal('decline', c)}
          onAssignFaculty={(c) => handleOpenModal('assign', c)}
        />
      )}

      {/* Real-time Socket.IO Clarification Chat Dialog */}
      {chatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(chatChallenge)}
          onClose={() => {
            setChatChallenge(null);
            fetchChallenges();
          }}
          challenge={chatChallenge}
          isUniversityView={true}
          onAcceptChallenge={(c) => {
            setChatChallenge(null);
            handleDirectAccept(c);
          }}
          onDeclineChallenge={(c) => {
            setChatChallenge(null);
            handleDirectDecline(c);
          }}
        />
      )}

      {/* Action Dialog */}
      <ChallengeActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        challenge={modalConfig.challenge}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AssignedChallengesPanel;
