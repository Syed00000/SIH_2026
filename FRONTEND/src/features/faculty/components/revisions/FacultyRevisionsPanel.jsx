import React, { useState } from 'react';
import { RotateCcw, Search, CheckCircle2 } from 'lucide-react';
import { RevisionCard } from './RevisionCard.jsx';
import { ResubmitRevisionModal } from './ResubmitRevisionModal.jsx';

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
      adminRemarks: p.adminRemarks || p.universityRemarks || 'Please revise methodology and line-item budget as requested.',
      requestedBy: p.leadMentor || faculty?.name || 'Lead Faculty Investigator',
      budget: p.budget || p.proposedBudget || '₹ 80,000',
      additionalAmount: p.additionalAmount || 0,
      updatedAt: p.updatedAt || new Date(),
      history: p.history || []
    }));

  const allRevisionsMap = new Map();
  revisions.forEach((r) => {
    const key = r.projectId || r.challengeId || r.approvalId;
    allRevisionsMap.set(key, {
      id: r.approvalId || r._id,
      projectId: r.projectId || r.challengeId,
      approvalId: r.approvalId || `APP-${r.projectId || '001'}`,
      projectTitle: r.title || r.project || 'Grassroots Research Solution',
      challengeId: r.challengeId || 'CHL-JH-2026',
      domain: r.faculty?.department || 'Engineering',
      district: r.district || 'Ranchi',
      type: r.type || 'Proposal & Budget Revision',
      status: r.status || 'Changes Required',
      adminRemarks: r.adminRemarks || 'Please address university evaluation committee directives and resubmit.',
      requestedBy: r.requestedBy || faculty?.name || 'Lead Faculty Investigator',
      budget: r.proposedBudget || r.grantRequested || r.estimatedBudget || '₹ 80,000',
      additionalAmount: r.additionalAmount || 0,
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
      const existing = allRevisionsMap.get(key);
      allRevisionsMap.set(key, {
        ...existing,
        adminRemarks: pr.adminRemarks || existing.adminRemarks,
        domain: pr.domain || existing.domain,
        additionalAmount: pr.additionalAmount || existing.additionalAmount
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
    if (filterType === 'pending') return item.status === 'Changes Required' || item.status === 'Changes Requested';
    if (filterType === 'resubmitted') return item.status === 'Pending' || item.status === 'Under Review';
    return true;
  });

  const pendingCount = combinedList.filter((r) => r.status === 'Changes Required' || r.status === 'Changes Requested').length;
  const resubmittedCount = combinedList.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
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
        <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
            {pendingCount}
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase block">Pending Revisions</span>
            <span className="text-xs text-amber-700 font-semibold">Action Needed</span>
          </div>
        </div>
      </div>

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
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'all' ? 'bg-[#007A61] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Requests ({combinedList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'pending' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'}`}
          >
            Action Required ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('resubmitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'resubmitted' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Resubmitted ({resubmittedCount})
          </button>
        </div>
      </div>

      {filteredList.length > 0 ? (
        <div className="space-y-3">
          {filteredList.map((item, idx) => (
            <RevisionCard
              key={idx}
              item={item}
              onOpenResubmit={setResubmitModalItem}
              onNavigateWorkspace={(pId) => onNavigateTab && onNavigateTab('project-workspace', pId)}
            />
          ))}
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

      {resubmitModalItem && (
        <ResubmitRevisionModal
          item={resubmitModalItem}
          faculty={faculty}
          onClose={() => setResubmitModalItem(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

export default FacultyRevisionsPanel;
