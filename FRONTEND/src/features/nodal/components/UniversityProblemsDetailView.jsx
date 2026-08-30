import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  User,
  MapPin,
  ExternalLink,
  Search,
  Layers,
  AlertCircle,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  Trash2,
  XCircle,
  RotateCcw,
  Info,
  GraduationCap,
  Globe,
  Mail,
  Award,
  ChevronRight,
  FileText,
  X
} from 'lucide-react';
import { citizenService } from '../../citizen/services/citizenService.js';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierModal } from './ProblemEvidenceDossierModal.jsx';

const STATUS_FILTERS = ['All', 'In Progress', 'Under Review', 'Resolved', 'Rejected'];

export const UniversityProblemsDetailView = ({
  university,
  assignedChallenges = [],
  allChallenges = [],
  onBack,
  onReload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Modal states
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [targetUniForAllocation, setTargetUniForAllocation] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDossierChallenge, setSelectedDossierChallenge] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  if (!university) return null;

  const handleOpenEditOrReassign = (chl) => {
    setTargetUniForAllocation(null);
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignNew = () => {
    setTargetUniForAllocation(university);
    setSelectedChallenge(null);
    setIsAssignModalOpen(true);
  };

  const handleQuickReject = async (e, chl) => {
    e.stopPropagation();
    const reason = prompt('Enter official rejection reason for this problem statement:', 'Out of institutional research scope / Incomplete ground data');
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
      if (onReload) onReload();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to reject challenge: ' + err.message);
    }
  };

  const handleQuickDelete = async (e, chl) => {
    e.stopPropagation();
    const chlId = chl.challengeId || chl.id;
    if (!window.confirm(`Are you sure you want to permanently delete / dismiss ${chlId}?`)) {
      return;
    }

    try {
      setDeletingId(chlId);
      await citizenService.deleteChallenge(chlId);
      setToastMsg(`Problem statement ${chlId} deleted successfully.`);
      if (onReload) onReload();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete problem: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTriageSuccess = (updatedData) => {
    if (updatedData?.deleted) {
      setToastMsg(`Problem ${updatedData.challengeId} deleted from database.`);
    } else {
      setToastMsg(`Problem successfully updated & synchronized in MongoDB!`);
    }
    if (onReload) onReload();
    setTimeout(() => setToastMsg(''), 5000);
  };

  const filtered = assignedChallenges.filter((chl) => {
    const status = chl.status || 'In Progress';
    const priority = chl.priority || 'Medium';

    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (priorityFilter !== 'All' && priority !== priorityFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (chl.title || '').toLowerCase().includes(q) ||
        (chl.challengeId || chl.id || '').toLowerCase().includes(q) ||
        (chl.description || '').toLowerCase().includes(q) ||
        (chl.domain || '').toLowerCase().includes(q) ||
        (chl.location?.district || chl.district || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 select-none text-left animate-in fade-in duration-150">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold rounded-lg flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card in Citizen Theme with Profile Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex items-start space-x-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs mt-0.5"
            title="Back to Universities Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {university.name}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {university.code}
              </span>
              <span className="text-xs font-bold text-slate-500">
                &bull; {university.district || 'Jharkhand'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {university.legalName || university.name} &bull; AISHE: {university.aisheCode || 'U-0000'} &bull; Type: {university.universityType || university.type || 'State University'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* View Profile Button */}
          <button
            onClick={() => setShowProfileDrawer(!showProfileDrawer)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>{showProfileDrawer ? 'Hide Profile' : 'Institution Profile'}</span>
          </button>

          {/* Allocate New Problem */}
          <button
            onClick={handleOpenAssignNew}
            className="flex items-center justify-center space-x-2 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#064e3b] text-xs font-bold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Allocate Problem</span>
          </button>
        </div>
      </div>

      {/* Institution Profile & Capacity Section (Collapsible) */}
      {showProfileDrawer && (
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-[#047857]" />
              <h3 className="text-sm font-extrabold text-slate-900">Institution Profile & Research Capacity</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified HEI Record
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Assigned Problems</span>
              <span className="text-base font-extrabold text-slate-900">{assignedChallenges.length}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Accepted by HEI</span>
              <span className="text-base font-extrabold text-[#047857]">
                {assignedChallenges.filter(
                  (c) => c.assignedUniversity?.acceptanceStatus === 'Accepted' || c.status === 'In Progress' || c.status === 'Resolved'
                ).length}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Pending Review</span>
              <span className="text-base font-extrabold text-amber-700">
                {assignedChallenges.filter(
                  (c) => !c.assignedUniversity?.acceptanceStatus || c.assignedUniversity?.acceptanceStatus === 'Pending Review'
                ).length}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Resolved / Completed</span>
              <span className="text-base font-extrabold text-emerald-800">
                {assignedChallenges.filter((c) => c.status === 'Resolved').length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-slate-100">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 block">Institution Nodal Point of Contact:</span>
              <div className="text-slate-600 space-y-1">
                <p className="font-extrabold text-slate-900">
                  {university.nodalOfficer?.name || 'Office of the Registrar / R&D Dean'}
                </p>
                <p className="text-slate-500">
                  {university.nodalOfficer?.designation || 'Institutional Nodal Lead & R&D Coordinator'}
                </p>
                {(university.universityEmail || university.nodalOfficer?.email) && (
                  <p className="flex items-center space-x-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{university.universityEmail || university.nodalOfficer?.email}</span>
                  </p>
                )}
                {(university.universityPhone || university.nodalOfficer?.phone) && (
                  <p className="flex items-center space-x-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{university.universityPhone || university.nodalOfficer?.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block">Accreditation & Campus:</span>
              <div className="space-y-1.5 text-slate-600">
                <p>
                  <strong>NAAC Grade:</strong> {university.accreditation?.naacGrade || 'Accredited'}
                  {university.accreditation?.nirfRanking ? ` • NIRF Rank: #${university.accreditation.nirfRanking}` : ''}
                </p>
                {university.website && (
                  <p>
                    <strong>Official Website:</strong>{' '}
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#047857] hover:underline font-semibold"
                    >
                      {university.website}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Campus Location:</strong>{' '}
                  {university.address?.addressLine1 ? `${university.address.addressLine1}, ` : ''}{university.district || 'Jharkhand'}, Jharkhand
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search Input & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by challenge ID, problem description, district, domain..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean Filter Tabs Bar */}
        <div className="flex items-center space-x-1 bg-white p-1 border border-slate-200/90 rounded-lg shadow-2xs overflow-x-auto">
          {STATUS_FILTERS.map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#064e3b] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Problem Statements List View */}
      {assignedChallenges.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-lg p-10 text-center space-y-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              No Problem Statements Assigned Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              <strong>{university.name}</strong> currently has 0 problem statements allocated. Nodal Officers can assign an open citizen problem statement to this institution.
            </p>
          </div>
          <button
            onClick={handleOpenAssignNew}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200 hover:border-[#064e3b] text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Allocate First Problem</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-lg p-10 text-center space-y-3 shadow-2xs">
          <p className="text-xs font-bold text-slate-700">No problem statements matched your active filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setPriorityFilter('All');
            }}
            className="text-xs font-bold text-[#047857] hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ch) => {
            const formattedDate = ch.submittedAt
              ? new Date(ch.submittedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : '29 Aug 2026';

            const statusStr = ch.status || 'In Progress';
            const isResolved = statusStr === 'Resolved';
            const isRejected = statusStr === 'Rejected';
            const isInProgress = statusStr === 'In Progress' || statusStr === 'Accepted';
            const priorityStr = ch.priority || 'Medium';

            const acceptance = ch.assignedUniversity?.acceptanceStatus || ch.acceptanceStatus || 'Pending Review';
            const isAccepted = acceptance === 'Accepted';
            const isDeclined = acceptance === 'Declined';

            return (
              <div
                key={ch.challengeId || ch._id}
                onClick={() => handleOpenEditOrReassign(ch)}
                className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-lg p-4.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer space-y-3 text-left"
              >
                {/* Header Row: Pure text ID & Priority on Left, HEI Acceptance & Status on Right */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {ch.challengeId || ch.id}
                    </span>
                    {priorityStr && (
                      <span className={`text-xs font-semibold ${
                        priorityStr === 'Critical' || priorityStr === 'High'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}>
                        Priority: {priorityStr}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-extrabold">
                    {/* HEI Response / Acceptance Badge */}
                    <span
                      className={`flex items-center space-x-1 ${
                        isAccepted
                          ? 'text-emerald-700'
                          : isDeclined
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      <span>
                        {isAccepted
                          ? 'Accepted by HEI'
                          : isDeclined
                          ? 'Declined by HEI (Reassign Required)'
                          : 'Pending HEI Acceptance'}
                      </span>
                    </span>

                    <span className="text-slate-300">|</span>

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
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "{ch.description || ch.problemStatement}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-0.5">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ch.location?.district || ch.district || 'Ranchi'}, Jharkhand</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Submitter: {ch.submitter?.name || ch.submittedBy || 'Citizen'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Dept: {ch.assignedUniversity?.department || 'R&D Lab'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Action Row: Domain + Actions */}
                <div
                  className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700">
                      {ch.domain || 'Urban Development'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Inspect Evidence & GIS Dossier */}
                    <button
                      onClick={() => setSelectedDossierChallenge(ch)}
                      className="text-xs font-bold text-slate-700 hover:text-[#047857] bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                      title="Inspect Geo-spatial coordinates, field evidence photos & voice testimony"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#047857]" />
                      <span>Evidence & GIS</span>
                    </button>

                    {/* Reassign Button (Always available for Nodal Officer) */}
                    <button
                      onClick={() => handleOpenEditOrReassign(ch)}
                      className="text-xs font-bold text-amber-800 hover:text-white bg-amber-50 hover:bg-amber-700 border border-amber-200 hover:border-amber-700 px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                      title="Reassign problem to another university in Jharkhand"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reassign HEI</span>
                    </button>

                    {/* Reject Button (if not already rejected) */}
                    {!isRejected && (
                      <button
                        onClick={(e) => handleQuickReject(e, ch)}
                        className="text-xs font-bold text-slate-500 hover:text-rose-700 px-2.5 py-1 rounded-md border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer flex items-center space-x-1"
                        title="Reject problem statement"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Delete / Dismiss Button */}
                    <button
                      onClick={(e) => handleQuickDelete(e, ch)}
                      disabled={deletingId === (ch.challengeId || ch.id)}
                      className="text-xs font-bold text-rose-600 hover:text-white px-2.5 py-1 rounded-md border border-rose-200 hover:border-rose-600 hover:bg-rose-600 transition-all cursor-pointer flex items-center space-x-1"
                      title="Delete / Dismiss Problem from MongoDB"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingId === (ch.challengeId || ch.id) ? 'Deleting...' : 'Delete'}</span>
                    </button>

                    {/* Triage & Edit Details */}
                    <button
                      onClick={() => handleOpenEditOrReassign(ch)}
                      className="text-xs text-emerald-800 hover:text-white bg-white hover:bg-[#064e3b] border border-slate-200 hover:border-[#064e3b] font-bold px-3 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>Triage & Edit</span>
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

      {/* Allocation / Triage Modal */}
      <NodalAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setTargetUniForAllocation(null);
          setSelectedChallenge(null);
        }}
        targetUniversity={targetUniForAllocation}
        challenge={selectedChallenge}
        onSuccess={handleTriageSuccess}
      />
    </div>
  );
};

export default UniversityProblemsDetailView;
