import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  UserCheck,
  UserX,
  Layers,
  Trash2
} from 'lucide-react';
import { ProblemEvidenceDossierModal } from '../../../nodal/components/ProblemEvidenceDossierModal.jsx';
import { facultyApiService } from '../../services/facultyApiService.js';

export const FacultyAssignedChallenges = ({
  challenges = [],
  allChallenges = [],
  faculty,
  onDraftProposal,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [allocationFilter, setAllocationFilter] = useState('my'); // 'my' | 'all' | 'reassigned'
  const [selectedDossier, setSelectedDossier] = useState(null);

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

  const pool = (allChallenges && allChallenges.length > 0) ? allChallenges : challenges;

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

  const handleDropChallenge = async (c) => {
    const cid = c.challengeId || c.id;
    if (!cid) return;
    if (window.confirm(`Are you sure you want to decline/drop this problem assignment "${c.title}"? It will be unassigned from you and returned to Ranchi University.`)) {
      try {
        await facultyApiService.dropChallenge(cid, faculty?.universityCode || 'RU001');
        if (onRefresh) await onRefresh();
        else window.location.reload();
      } catch (err) {
        alert('Failed to drop challenge: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Faculty Research Node</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Assigned Problem Statements</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-[#007A61]" />
            <span>Official Grassroots Problem Statements</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ground problems allocated by Ranchi University for solution scoping and prototype formulation.
          </p>
        </div>

        {/* Allocation Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAllocationFilter('my')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              allocationFilter === 'my'
                ? 'bg-white text-[#007A61] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Assigned to You</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              allocationFilter === 'my' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {myCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAllocationFilter('reassigned')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              allocationFilter === 'reassigned'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Reassigned / Allocated</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              allocationFilter === 'reassigned' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {reassignedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAllocationFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              allocationFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All ({pool.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
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

      {/* Problems Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">
            {allocationFilter === 'my'
              ? 'No Problem Statements Currently Assigned to You'
              : allocationFilter === 'reassigned'
              ? 'No Reassigned Problems Found'
              : 'No Problem Statements Found'}
          </h3>
          <p className="text-xs max-w-md mx-auto">
            {allocationFilter === 'my'
              ? 'Problems assigned to other faculties or reassigned will appear under the "Reassigned / Allocated" tab.'
              : 'When the University allocates problems to faculty mentors, they will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((c, idx) => {
            const domain = c.domain || c.category || 'Innovation';
            const loc = c.location?.district || c.district || 'Jharkhand';
            const status = getAssignmentStatus(c);

            return (
              <div
                key={c.challengeId || idx}
                className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all flex flex-col justify-between space-y-3 ${
                  status.isAssignedToMe
                    ? 'border-emerald-200 hover:border-emerald-400'
                    : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {c.challengeId}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {domain}
                      </span>
                    </div>

                    {status.isAssignedToMe ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200 whitespace-nowrap shadow-2xs">
                        ✓ Assigned to You
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shadow-2xs flex items-center space-x-1">
                        <UserCheck className="w-3 h-3 text-blue-600" />
                        <span>Allocated to: {status.mentorName}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {c.problemStatement || c.description || 'No detailed problem statement provided.'}
                  </p>

                  {!status.isAssignedToMe && (
                    <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-0.5">
                      <div className="text-[11px] font-bold text-blue-900 flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lead Mentor: {status.mentorName}</span>
                      </div>
                      <div className="text-[10px] text-blue-700">
                        {status.mentorDept} &bull; Reassigned by University Nodal Cell
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{loc}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDossier(c)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>Evidence Dossier</span>
                  </button>

                  {status.isAssignedToMe ? (
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleDropChallenge(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Decline / Drop Problem Assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDraftProposal ? onDraftProposal(c) : null}
                        className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Draft Proposal & Budget</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-500 rounded-xl text-[10.5px] font-bold">
                      Reassigned to {status.mentorName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedDossier && (
        <ProblemEvidenceDossierModal
          isOpen={true}
          onClose={() => setSelectedDossier(null)}
          challenge={selectedDossier}
        />
      )}
    </div>
  );
};

export default FacultyAssignedChallenges;
