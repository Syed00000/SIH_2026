import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Layers,
  Building,
  Eye,
  User,
  MapPin,
  Sparkles,
  Send,
  Trash2,
  XCircle,
  RotateCcw,
  Calendar,
  FileText,
  X
} from 'lucide-react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierModal } from './ProblemEvidenceDossierModal.jsx';
import { citizenService } from '../../citizen/services/citizenService.js';

export const NodalChallenges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDossierChallenge, setSelectedDossierChallenge] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const res = await citizenService.fetchChallenges({ limit: 150 });
      const list = res?.challenges || (Array.isArray(res) ? res : []) || (res?.data?.challenges || []);
      setChallenges(list);
    } catch (err) {
      console.warn('Error loading live citizen challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleOpenTriage = (chl) => {
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleQuickReject = async (e, chl) => {
    e.stopPropagation();
    const reason = prompt('Enter official rejection reason for this problem statement:', 'Duplicate submission / Incomplete field data');
    if (!reason) return;

    try {
      const chlId = chl.challengeId || chl.id;
      const { apiClient } = await import('../../../infrastructure/api/client.js');
      await apiClient.patch(`citizen/challenges/${chlId}/triage`, {
        status: 'Rejected',
        remarks: `Rejected by State Nodal Cell: ${reason}`,
        priority: chl.priority || 'Low'
      });
      setToastMsg(`Problem statement ${chlId} marked as rejected.`);
      loadChallenges();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to reject challenge: ' + err.message);
    }
  };

  const handleQuickDelete = async (e, chl) => {
    e.stopPropagation();
    const chlId = chl.challengeId || chl.id;
    if (!window.confirm(`Are you sure you want to permanently delete / dismiss ${chlId} from MongoDB?`)) {
      return;
    }

    try {
      setDeletingId(chlId);
      await citizenService.deleteChallenge(chlId);
      setToastMsg(`Problem statement ${chlId} deleted successfully from MongoDB.`);
      loadChallenges();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete problem: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTriageSuccess = (updatedData) => {
    const targetId = selectedChallenge?.challengeId || selectedChallenge?.id;
    if (updatedData?.deleted) {
      setToastMsg(`Problem ${targetId} permanently deleted.`);
    } else {
      setToastMsg(`Challenge ${targetId} successfully updated & synchronized in MongoDB!`);
    }
    loadChallenges();
    setTimeout(() => setToastMsg(''), 5000);
  };

  const filtered = challenges.filter((c) => {
    const status = c.status || 'Under Review';
    const domain = c.domain || '';
    const district = c.location?.district || c.district || '';
    const priority = c.priority || 'Medium';

    if (statusFilter !== 'All Status' && status !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && !domain.includes(domainFilter)) return false;
    if (districtFilter !== 'All Districts' && district !== districtFilter) return false;
    if (priorityFilter !== 'All Priority' && priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (c.title || '').toLowerCase().includes(q) ||
        (c.challengeId || c.id || '').toLowerCase().includes(q) ||
        (c.submitter?.name || '').toLowerCase().includes(q) ||
        district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none text-left">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold rounded-lg flex items-center space-x-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Citizen Challenges Triage & Allocation Hub
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Review ground problem statements submitted by citizens, verify community scope, and allocate to universities.
          </p>
        </div>

        <button
          onClick={loadChallenges}
          className="flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : 'text-slate-500'}`} />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <NodalFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        totalCount={filtered.length}
      />

      {/* Challenges Feed in Clean Citizen Style */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2.5 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
          <span className="text-xs font-semibold text-slate-600">Fetching live citizen submissions from MongoDB...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-lg p-10 text-center space-y-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No Citizen Challenges Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are currently no challenges in the database matching your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const id = item.challengeId || item.id || item._id;
            const priority = item.priority || 'Medium';
            const assignedUni = item.assignedUniversity?.name;
            const submitterName = item.submitter?.name || item.submittedBy || 'Citizen';
            const district = item.location?.district || item.district || 'Jharkhand';
            const formattedDate = item.submittedAt
              ? new Date(item.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : '29 Aug 2026';

            const statusStr = item.status || 'Under Review';
            const isResolved = statusStr === 'Resolved';
            const isRejected = statusStr === 'Rejected';
            const isInProgress = statusStr === 'In Progress' || statusStr === 'Accepted';

            const acceptance = item.assignedUniversity?.acceptanceStatus || item.acceptanceStatus || (assignedUni ? 'Pending Review' : 'Not Assigned');
            const isAccepted = acceptance === 'Accepted';
            const isDeclined = acceptance === 'Declined';

            return (
              <div
                key={id}
                onClick={() => handleOpenTriage(item)}
                className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-lg p-4.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer space-y-3 text-left"
              >
                {/* Header Row: ID + Priority on Left, HEI Acceptance & Status on Right */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {id}
                    </span>
                    {priority && (
                      <span className={`text-xs font-semibold ${
                        priority === 'Critical' || priority === 'High' ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        Priority: {priority}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-extrabold">
                    {/* HEI Response Status */}
                    {assignedUni && (
                      <>
                        <span
                          className={`flex items-center space-x-1 ${
                            isAccepted ? 'text-emerald-700' : isDeclined ? 'text-rose-700' : 'text-amber-700'
                          }`}
                        >
                          <span>
                            {isAccepted ? 'Accepted by HEI' : isDeclined ? 'Declined by HEI' : 'Pending HEI Review'}
                          </span>
                        </span>
                        <span className="text-slate-300">|</span>
                      </>
                    )}

                    {/* Overall Citizen Status Text */}
                    <span
                      className={`${
                        isResolved
                          ? 'text-emerald-700'
                          : isRejected
                          ? 'text-rose-700'
                          : isInProgress
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {statusStr}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "{item.description || item.problemStatement}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{district}, Jharkhand</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Submitter: {submitterName}</span>
                    </span>
                    {assignedUni && (
                      <span className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                        <Building className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                        <span>HEI: {assignedUni}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div
                  className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700">
                      {item.domain || 'Community Infrastructure'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Inspect Evidence & GIS Dossier */}
                    <button
                      onClick={() => setSelectedDossierChallenge(item)}
                      className="text-xs font-bold text-slate-700 hover:text-[#047857] bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                      title="Inspect Geo-spatial coordinates, field evidence photos & voice testimony"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#047857]" />
                      <span>Evidence & GIS</span>
                    </button>

                    {/* Reassign Button (if assigned already) */}
                    {assignedUni && (
                      <button
                        onClick={() => handleOpenTriage(item)}
                        className="text-xs font-bold text-amber-800 hover:text-white bg-amber-50 hover:bg-amber-700 border border-amber-200 hover:border-amber-700 px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                        title="Reassign to another university in Jharkhand"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reassign HEI</span>
                      </button>
                    )}

                    {/* Reject Button (if not rejected) */}
                    {!isRejected && (
                      <button
                        onClick={(e) => handleQuickReject(e, item)}
                        className="text-xs font-bold text-slate-500 hover:text-rose-700 px-2.5 py-1 rounded-md border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer flex items-center space-x-1"
                        title="Reject problem statement"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Delete / Dismiss Button */}
                    <button
                      onClick={(e) => handleQuickDelete(e, item)}
                      disabled={deletingId === id}
                      className="text-xs font-bold text-rose-600 hover:text-white px-2.5 py-1 rounded-md border border-rose-200 hover:border-rose-600 hover:bg-rose-600 transition-all cursor-pointer flex items-center space-x-1"
                      title="Permanently delete from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === id ? 'Deleting...' : 'Delete'}</span>
                    </button>

                    {/* Triage & Allocate / Edit Button */}
                    <button
                      onClick={() => handleOpenTriage(item)}
                      className="text-xs text-emerald-800 hover:text-white bg-white hover:bg-[#064e3b] border border-slate-200 hover:border-[#064e3b] font-bold px-3 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{assignedUni ? 'Edit Triage' : 'Triage & Allocate'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ground Evidence & Geo-Spatial Investigation Dossier Modal */}
      <ProblemEvidenceDossierModal
        challenge={selectedDossierChallenge}
        isOpen={Boolean(selectedDossierChallenge)}
        onClose={() => setSelectedDossierChallenge(null)}
        onOpenTriage={(c) => {
          setSelectedChallenge(c);
          setIsAssignModalOpen(true);
        }}
        onOpenReassign={(c) => {
          setSelectedChallenge(c);
          setIsAssignModalOpen(true);
        }}
      />

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

export default NodalChallenges;
