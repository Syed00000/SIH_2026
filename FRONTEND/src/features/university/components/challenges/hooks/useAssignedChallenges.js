import { useState, useEffect } from 'react';
import { universityApiService } from '../../../services/universityApiService.js';
import { clarificationChatService } from '../../../../clarification/services/clarificationChatService.js';

export const getNormalizedStatus = (challenge) => {
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

export const useAssignedChallenges = ({
  initialChallenges = [],
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
  const [chatStatsMap, setChatStatsMap] = useState({});

  const fetchChatStats = async () => {
    try {
      const stats = await clarificationChatService.getChallengeStats();
      if (stats && typeof stats === 'object') {
        setChatStatsMap(stats);
      }
    } catch (err) {
      console.warn('Error fetching challenge chat stats:', err);
    }
  };

  useEffect(() => {
    fetchChatStats();
    const interval = setInterval(fetchChatStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const data = await universityApiService.getAssignedChallenges(universityCode);
    const list = data?.challenges || (Array.isArray(data) ? data : []);
    setChallengeList(list.length > 0 ? list : (initialChallenges.length > 0 ? initialChallenges : []));
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

  const handleModalSubmit = async (payload) => {
    const { type, challengeId, reason, remarks, query } = payload;
    const newStatus = type === 'decline' || type === 'reject' ? 'Rejected' : type === 'clarify' ? 'Clarification Requested' : 'Accepted';
    const actionText = type === 'clarify' ? 'Clarification Active' : 'View';

    if (type === 'assign') {
      const facObj = {
        name: payload.facultyName || payload.name,
        department: payload.department,
        email: payload.facultyEmail || payload.email || ''
      };
      if (onAssignFaculty) await onAssignFaculty({ challengeId, ...facObj, facultyName: facObj.name });
      else await universityApiService.assignFaculty(challengeId, universityCode, facObj);
    } else {
      const metadata = { declineReason: reason, remarks, query: query || remarks };
      if (onUpdateChallengeStatus) await onUpdateChallengeStatus(challengeId, newStatus, actionText, metadata);
      else await universityApiService.updateChallengeStatus(challengeId, universityCode, newStatus, actionText, metadata);
    }
    await fetchChallenges();
  };

  return {
    statusFilter, setStatusFilter,
    domainFilter, setDomainFilter,
    districtFilter, setDistrictFilter,
    priorityFilter, setPriorityFilter,
    dateRange, setDateRange,
    searchTerm, setSearchTerm,
    filtered, challengeList,
    selectedChallenge, setSelectedChallenge,
    dossierChallenge, setDossierChallenge,
    chatChallenge, setChatChallenge,
    loading, modalConfig, setModalConfig,
    chatStatsMap, fetchChatStats,
    handleModalSubmit
  };
};

export default useAssignedChallenges;
