import React, { useState, useEffect } from 'react';
import { ChallengesFilterBar } from './ChallengesFilterBar.jsx';
import { ChallengesTable } from './ChallengesTable.jsx';
import { ChallengeInspector } from './ChallengeInspector.jsx';
import { ChallengeActionModal } from './ChallengeActionModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const AssignedChallengesPanel = ({
  challenges: initialChallenges = [],
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
  const [selectedChallenge, setSelectedChallenge] = useState(initialChallenges[0] || null);
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'accept', challenge: null });

  const fetchChallenges = async () => {
    setLoading(true);
    const data = await universityApiService.getAssignedChallenges('RU001');
    const list = data?.challenges || (Array.isArray(data) ? data : []);
    if (list.length > 0) {
      setChallengeList(list);
      setSelectedChallenge(list[0]);
    } else if (initialChallenges.length > 0) {
      setChallengeList(initialChallenges);
      setSelectedChallenge(initialChallenges[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (initialChallenges && initialChallenges.length > 0) {
      setChallengeList(initialChallenges);
      if (!selectedChallenge) setSelectedChallenge(initialChallenges[0]);
    }
  }, [initialChallenges]);

  const filtered = challengeList.filter((c) => {
    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false;
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
    let newStatus = 'Accepted';
    let actionText = 'View';

    if (type === 'clarify') {
      newStatus = 'Clarification';
      actionText = 'Respond';
    } else if (type === 'decline') {
      newStatus = 'Declined';
      actionText = 'Declined';
    } else if (type === 'assign') {
      newStatus = 'Accepted';
      actionText = 'View';
      if (onAssignFaculty) {
        await onAssignFaculty({ challengeId, facultyName: payload.facultyName, department: payload.department });
      } else {
        await universityApiService.assignFaculty(challengeId, 'RU001', {
          name: payload.facultyName,
          department: payload.department
        });
      }
    }

    if (type !== 'assign') {
      if (onUpdateChallengeStatus) {
        await onUpdateChallengeStatus(challengeId, newStatus, actionText);
      } else {
        await universityApiService.updateChallengeStatus(challengeId, 'RU001', newStatus, actionText);
      }
    }

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        <div className={selectedChallenge ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <ChallengesTable
            challenges={filtered}
            selectedChallengeId={selectedChallenge?.id || selectedChallenge?.challengeId}
            onSelectChallenge={(c) => setSelectedChallenge(c)}
            onActionClick={(c) => {
              setSelectedChallenge(c);
              if (c.status === 'Review') handleOpenModal('accept', c);
              else if (c.status === 'Faculty Pending') handleOpenModal('assign', c);
              else if (c.status === 'Clarification') handleOpenModal('clarify', c);
            }}
            totalCount={challengeList.length}
            loading={loading}
          />
        </div>

        {selectedChallenge && (
          <div className="lg:col-span-5 sticky top-16">
            <ChallengeInspector
              challenge={selectedChallenge}
              onClose={() => setSelectedChallenge(null)}
              onAccept={(c) => handleOpenModal('accept', c)}
              onRequestClarification={(c) => handleOpenModal('clarify', c)}
              onDecline={(c) => handleOpenModal('decline', c)}
            />
          </div>
        )}
      </div>

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
