import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  FileEdit,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Building2,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';

export const FacultyRevisionsPanel = ({
  revisions = [],
  projects = [],
  faculty,
  onNavigateTab,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [resubmitModalItem, setResubmitModalItem] = useState(null);
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Combine revisions from approvals and projects flagged with Changes Required
  const projectRevisions = projects
    .filter((p) => {
      const bStatus = String(p.budgetStatus || '').toLowerCase();
      const pStatus = String(p.prototypeStatus || '').toLowerCase();
      const gStatus = String(p.governmentStatus || '').toLowerCase();
      const status = String(p.status || '').toLowerCase();
      return (
        bStatus.includes('changes required') ||
        pStatus.includes('changes required') ||
        gStatus.includes('changes required') ||
        status.includes('changes required') ||
        Boolean(p.adminRemarks) ||
        Boolean(p.universityRemarks)
      );
    })
    .map((p) => ({
      id: p.projectId || p._id,
      projectId: p.projectId,
      approvalId: `APP-PRJ-${p.projectId?.replace(/[^0-9]/g, '') || '001'}`,
      projectTitle: p.title || 'Grassroots Research Solution',
      challengeId: p.challengeId || 'CHL-JH-2026',
      domain: p.domain || 'Engineering & Technology',
      district: p.district || 'Jharkhand',
      type: p.prototypeStatus?.includes('Changes') ? 'Prototype Revision' : 'Proposal & Budget Revision',
      status: 'Changes Required',
      adminRemarks: p.adminRemarks || p.universityRemarks || 'University review committee requested technical and budgetary revisions before state forwarding.',
      requestedBy: p.teamLead || faculty?.name || 'Lead Faculty Investigator',
      budget: p.proposedBudget || p.budget || p.sanctionedBudget || '₹ 2,15,015',
      updatedAt: p.updatedAt || new Date(),
      rawProject: p
    }));

  // Merge approval-based revisions and project revisions uniquely
  const allRevisionsMap = new Map();

  revisions.forEach((r) => {
    const key = r.projectId || r.approvalId || r.id;
    allRevisionsMap.set(key, {
      id: r.approvalId || r.id,
      projectId: r.projectId || r.approvalId?.replace('APP-', '') || 'PRJ-001',
      approvalId: r.approvalId || r.id,
      projectTitle: r.project || r.title || 'Grassroots Innovation Project',
      challengeId: r.challengeId || 'CHL-JH-2026',
      domain: r.department || r.domain || 'Applied Sciences',
      district: r.district || 'Ranchi',
      type: r.type || 'Proposal & Budget Revision',
      status: r.status || 'Changes Required',
      adminRemarks: r.adminRemarks || 'Please address university evaluation committee directives and resubmit.',
      requestedBy: r.requestedBy || faculty?.name || 'Lead Faculty Investigator',
      budget: r.grantRequested || '₹ 2,15,015',
      updatedAt: r.submittedDate || r.updatedAt || new Date(),
      history: r.history || [],
      rawApproval: r
    });
  });

  projectRevisions.forEach((pr) => {
    const key = pr.projectId || pr.approvalId;
    if (!allRevisionsMap.has(key)) {
      allRevisionsMap.set(key, pr);
    } else {
      // Update with latest project remarks if available
      const existing = allRevisionsMap.get(key);
      allRevisionsMap.set(key, {
        ...existing,
        adminRemarks: pr.adminRemarks || existing.adminRemarks,
        domain: pr.domain || existing.domain
      });
    }
  });

  const combinedList = Array.from(allRevisionsMap.values());

  const filteredList = combinedList.filter((item) => {
    const matchSearch =
      (item.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.projectId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.approvalId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.adminRemarks || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterType === 'pending') {
      return item.status === 'Changes Required' || item.status === 'Changes Requested';
    }
    if (filterType === 'resubmitted') {
      return item.status === 'Pending' || item.status === 'Under Review';
    }
    return true;
  });

  const pendingCount = combinedList.filter(
    (r) => r.status === 'Changes Required' || r.status === 'Changes Requested'
  ).length;
  const resubmittedCount = combinedList.filter(
    (r) => r.status === 'Pending' || r.status === 'Under Review'
  ).length;

  const handleOpenResubmitModal = (item) => {
    setResubmitModalItem(item);
    setResubmitNotes('');
    setSubmitSuccess(null);
  };

  const handleConfirmResubmit = async (e) => {
    e.preventDefault();
    if (!resubmitModalItem) return;
    setIsSubmitting(true);
    try {
      const id = resubmitModalItem.approvalId || resubmitModalItem.id;
      const uniCode = faculty?.universityCode || 'RU001';
      await facultyApiService.resubmitRevision(id, uniCode, resubmitNotes);
      setSubmitSuccess('Revision successfully resubmitted to University Authority review committee!');
      setTimeout(() => {
        setResubmitModalItem(null);
        setSubmitSuccess(null);
        if (onRefresh) onRefresh();
      }, 1200);
    } catch (err) {
      console.error('Failed to resubmit revision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      {/* Top Banner & Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
              University Authority Review Feedback
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Revision Requests & Directives</span>
          </h1>
          <p className="text-xs text-slate-600">
            Action items and technical feedback requested by the University Evaluation Authority before state grant approval.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
              {pendingCount}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-900 uppercase block">
                Pending Revisions
              </span>
              <span className="text-xs text-amber-700 font-semibold">Action Needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project, ID, or remarks..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#007A61] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Requests ({combinedList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Action Required ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('resubmitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'resubmitted'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Resubmitted ({resubmittedCount})
          </button>
        </div>
      </div>

      {/* Revision List Cards */}
      {filteredList.length > 0 ? (
        <div className="space-y-3">
          {filteredList.map((item, idx) => {
            const isChangesRequired =
              item.status === 'Changes Required' || item.status === 'Changes Requested';

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 transition-all hover:border-slate-300 space-y-3.5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.approvalId || item.projectId}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200">
                      {item.domain}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      • {item.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isChangesRequired ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center space-x-1.5 shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Changes Required by University Authority</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Resubmitted • Under Review</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Title and details */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {item.projectTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Origin: <strong>University Authority Review Cell</strong></span>
                    </span>
                    <span>•</span>
                    <span>Grant Budget: <strong className="text-slate-900">{item.budget}</strong></span>
                    <span>•</span>
                    <span>Lead PI: <strong>{item.requestedBy}</strong></span>
                  </div>
                </div>

                {/* University Authority Remarks Box (The exact feedback) */}
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>University Authority Directives & Remarks:</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed pl-5 italic">
                    "{item.adminRemarks}"
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Review decision logged in official university governance dossier.</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateTab) {
                          onNavigateTab('project-workspace', item.projectId);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-slate-600" />
                      <span>Open Project Workspace & Revise</span>
                    </button>

                    {isChangesRequired && (
                      <button
                        type="button"
                        onClick={() => handleOpenResubmitModal(item)}
                        className="px-4 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Resubmit to University Authority</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#007A61]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Pending Revision Requests</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All mentored research proposals and prototype blueprints are aligned with university and state evaluation standards.
          </p>
        </div>
      )}

      {/* Resubmit Modal */}
      {resubmitModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200/90 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Resubmit Revised Proposal</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {resubmitModalItem.approvalId || resubmitModalItem.projectId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setResubmitModalItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
              <span className="font-bold text-amber-900 block">Original Authority Remarks:</span>
              <p className="text-amber-950 italic">"{resubmitModalItem.adminRemarks}"</p>
            </div>

            <form onSubmit={handleConfirmResubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Faculty Revision Response / Summary of Changes *
                </label>
                <textarea
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Revised line-item budget telemetry allocations and updated methodology as requested by review committee."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
                />
              </div>

              {submitSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResubmitModalItem(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isSubmitting ? 'Resubmitting...' : 'Confirm & Resubmit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyRevisionsPanel;
