import React, { useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { ProblemEvidenceDossierPanel } from '../../../nodal/components/ProblemEvidenceDossierPanel.jsx';
import { facultyApiService } from '../../services/facultyApiService.js';
import { AssignedChallengesHeader } from './AssignedChallengesHeader.jsx';
import { FacultyChallengeCard } from './FacultyChallengeCard.jsx';
import { DeleteChallengeModal } from './DeleteChallengeModal.jsx';

export const FacultyAssignedChallenges = ({
  challenges = [],
  allChallenges = [],
  faculty,
  onRefresh,
  onDraftProposal
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [allocationFilter, setAllocationFilter] = useState('my');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletedIds, setDeletedIds] = useState(new Set());

  const getAssignmentStatus = (c) => {
    const cleanEmail = (faculty?.email || '').toLowerCase().trim();
    const facultyNameLower = (faculty?.name || '').toLowerCase().trim();
    const mentorEmail = (c.assignedFaculty?.email || c.assignedUniversity?.mentorEmail || '').toLowerCase().trim();
    const mentorName = (c.assignedFaculty?.name || c.assignedUniversity?.mentorName || '').trim();
    const mentorNameLower = mentorName.toLowerCase();
    const mentorDept = c.assignedFaculty?.department || c.assignedUniversity?.department || 'Engineering & Technology';

    const isAssignedToMe = Boolean(
      (cleanEmail && mentorEmail === cleanEmail) ||
      (facultyNameLower && mentorNameLower && (mentorNameLower.includes(facultyNameLower) || facultyNameLower.includes(mentorNameLower)))
    );

    return {
      isAssignedToMe,
      mentorName: mentorName || 'Assigned Faculty',
      mentorDept,
      hasMentor: Boolean(mentorName || mentorEmail)
    };
  };

  const handleConfirmDelete = async () => {
    if (!challengeToDelete) return;
    setDeleting(true);
    try {
      const id = challengeToDelete.challengeId || challengeToDelete.id || challengeToDelete._id;
      const uniCode = faculty?.universityCode || 'RU001';
      await facultyApiService.deleteChallenge(id, uniCode);
      setDeletedIds((prev) => new Set([...prev, id]));
      setChallengeToDelete(null);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to delete challenge:', err);
    } finally {
      setDeleting(false);
    }
  };

  const basePool = (allChallenges && allChallenges.length > 0) ? allChallenges : challenges;
  const pool = basePool.filter((c) => !deletedIds.has(c.challengeId || c.id || c._id));

  const myCount = pool.filter((c) => getAssignmentStatus(c).isAssignedToMe).length;
  const reassignedCount = pool.filter((c) => {
    const st = getAssignmentStatus(c);
    return !st.isAssignedToMe && st.hasMentor;
  }).length;

  const filtered = pool.filter((c) => {
    const st = getAssignmentStatus(c);
    if (allocationFilter === 'my' && !st.isAssignedToMe) return false;
    if (allocationFilter === 'reassigned' && (st.isAssignedToMe || !st.hasMentor)) return false;

    if (domainFilter !== 'All' && c.domain !== domainFilter && c.category !== domainFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.challengeId || '').toLowerCase().includes(q) ||
        (c.domain || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        st.mentorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (selectedDossier) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 animate-in fade-in duration-150 text-left">
        <ProblemEvidenceDossierPanel
          challenge={selectedDossier}
          onClose={() => setSelectedDossier(null)}
          isUniversityView={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      <AssignedChallengesHeader
        allocationFilter={allocationFilter}
        setAllocationFilter={setAllocationFilter}
        myCount={myCount}
        reassignedCount={reassignedCount}
        totalCount={pool.length}
      />

      <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by keyword, district, ID, mentor..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
          >
            <option value="All">All Thematic Domains</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">
            {allocationFilter === 'my'
              ? 'No Problem Statements Currently Assigned to You'
              : allocationFilter === 'reassigned'
              ? 'No Allocated Problems Found'
              : 'No Problem Statements Found'}
          </h3>
          <p className="text-xs max-w-md mx-auto">
            {allocationFilter === 'my'
              ? 'Problems assigned to other faculties or reassigned will appear under the "Allocated" tab.'
              : 'When the University allocates problems to faculty mentors, they will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((c, idx) => {
            const status = getAssignmentStatus(c);
            const isDeployed = c.status === 'Deployed' || Boolean(c.isDeployed) || Boolean(c.isLocked);
            return (
              <FacultyChallengeCard
                key={c.challengeId || idx}
                challenge={c}
                status={status}
                isDeployed={isDeployed}
                onOpenDossier={setSelectedDossier}
                onOpenDelete={setChallengeToDelete}
                onDraftProposal={onDraftProposal}
              />
            );
          })}
        </div>
      )}

      {challengeToDelete && (
        <DeleteChallengeModal
          challenge={challengeToDelete}
          deleting={deleting}
          onClose={() => setChallengeToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default FacultyAssignedChallenges;
