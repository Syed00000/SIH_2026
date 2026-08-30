import React, { useState, useEffect } from 'react';
import { ChallengesFilterBar } from './ChallengesFilterBar.jsx';
import { ChallengesTable } from './ChallengesTable.jsx';
import { ChallengeInspector } from './ChallengeInspector.jsx';
import { ChallengeActionModal } from './ChallengeActionModal.jsx';
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (initialChallenges && initialChallenges.length > 0) {
      setChallengeList(initialChallenges);
    }
  }, [initialChallenges]);

  const getNormalizedStatus = (status) => {
    if (!status) return 'Pending';
    const s = String(status).toLowerCase();
    if (s.includes('accept') || s === 'completed') return 'Accepted';
    if (s.includes('reject') || s.includes('decline')) return 'Rejected';
    return 'Pending';
  };

  const filtered = challengeList.filter((c) => {
    if (statusFilter !== 'All Status' && getNormalizedStatus(c.status) !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && c.domain !== domainFilter) return false;
    if (districtFilter !== 'All Districts' && c.district !== districtFilter) return false;
    if (priorityFilter !== 'All Priority' && c.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const id = c.id || c.challengeId || '';
      return c.title.toLowerCase().includes(q) || id.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenModal = (type, challenge) => {
    setModalConfig({ isOpen: true, type, challenge });
  };

  const handleModalSubmit = async (payload) => {
    const { type, challengeId } = payload;
    let newStatus = type === 'decline' || type === 'reject' ? 'Rejected' : 'Accepted';
    let actionText = 'View';

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
      if (onUpdateChallengeStatus) {
        await onUpdateChallengeStatus(challengeId, newStatus, actionText);
      } else {
        await universityApiService.updateChallengeStatus(challengeId, universityCode, newStatus, actionText);
      }
    }

    setSelectedChallenge((prev) => (prev && (prev.id === challengeId || prev.challengeId === challengeId) ? { ...prev, status: newStatus, actionText, actionLabel: actionText } : prev));
    setChallengeList((prev) => prev.map((c) => (c.id === challengeId || c.challengeId === challengeId ? { ...c, status: newStatus, actionText, actionLabel: actionText } : c)));
    await fetchChallenges();
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Challenges</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review and take action on challenges assigned by the Government of Jharkhand.
        </p>
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
          selectedChallengeId={selectedChallenge?.id || selectedChallenge?.challengeId}
          onSelectChallenge={(c) => setSelectedChallenge(c)}
          onActionClick={(c) => setSelectedChallenge(c)}
          totalCount={challengeList.length}
          loading={loading}
        />
      </div>

      {selectedChallenge && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="bg-white border border-slate-200/90 rounded-xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <ChallengeInspector
              challenge={selectedChallenge}
              onClose={() => setSelectedChallenge(null)}
              onAccept={(c) => handleOpenModal('accept', c)}
              onRequestClarification={(c) => handleOpenModal('clarify', c)}
              onDecline={(c) => handleOpenModal('decline', c)}
            />
          </div>
        </div>
      )}

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
