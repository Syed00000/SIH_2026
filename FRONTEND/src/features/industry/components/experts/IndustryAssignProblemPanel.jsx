import React, { useState } from 'react';
import {
  CheckCircle2, UserCheck, FolderGit2, FileText,
  Building2, Users, ExternalLink
} from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { industryExpertService } from '../../services/industryExpertService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';
import { IndustryAssignedProblemsList } from './IndustryAssignedProblemsList.jsx';

export const IndustryAssignProblemPanel = ({
  expert, eligibleProblems = [], onBack, onSuccess
}) => {
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!expert) return null;

  const assignedList = expert.assignedProblems || [];
  const assignedRequestIds = new Set(assignedList.map((p) => p.requestId));
  const availableToAssign = eligibleProblems.filter((p) => !assignedRequestIds.has(p.requestId));
  const activeProblem = availableToAssign.find((p) => p.requestId === selectedProblemId) || availableToAssign[0] || null;

  const handleAssign = async () => {
    if (!activeProblem) return;
    setIsSubmitting(true);
    setError('');
    try {
      await industryExpertService.assignProblem(expert.expertId, {
        requestId: activeProblem.requestId,
        projectId: activeProblem.projectId,
        challengeId: activeProblem.challengeId,
        problemTitle: activeProblem.title,
        problemStatement: activeProblem.problemStatement,
        universityCode: activeProblem.universityCode,
        universityName: activeProblem.universityName,
        studentTeam: activeProblem.studentTeam,
        leadMentor: activeProblem.leadMentor
      });
      onSuccess && onSuccess();
      onBack();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to assign problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = async (requestId) => {
    setIsSubmitting(true);
    setError('');
    try {
      await industryExpertService.unassignProblem(expert.expertId, requestId);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to unassign problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullPageDetailPanel
      onBack={onBack}
      backLabel="Back to Experts & Engineers"
      breadcrumbs={['Corporate Innovation Node', 'Experts & Mentors', expert.name || expert.expertId]}
      idBadge={expert.expertId || 'EXP-2026'}
      statusBadge={
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center space-x-1">
          <UserCheck className="w-3 h-3 text-emerald-700" />
          <span>Verified Corporate Guide</span>
        </span>
      }
      title={`Assign Problem Statement to ${expert.name}`}
      subtitle={`${expert.designation || 'Domain Specialist'} • ${expert.domain || 'Engineering & Technology'} • ${expert.email || 'corporate@partner.com'}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            Back to Experts
          </button>
          {activeProblem && (
            <button
              type="button"
              onClick={handleAssign}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Assign Expert to Problem</span>
            </button>
          )}
        </div>
      }
    >
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-bold">
          {error}
        </div>
      )}

      {/* Eligible Problems Selection */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-2">
          <FolderGit2 className="w-4 h-4 text-[#007A61]" />
          <span>Sanctioned Problems Awaiting Mentorship ({availableToAssign.length})</span>
        </h4>

        {availableToAssign.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No unassigned problems currently awaiting mentorship for this expert.
          </div>
        ) : (
          <div className="space-y-3">
            <select
              value={activeProblem?.requestId || ''}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            >
              {availableToAssign.map((p) => (
                <option key={p.requestId} value={p.requestId}>
                  {p.title} ({p.universityName || 'University'}) &bull; {p.requestId}
                </option>
              ))}
            </select>

            {activeProblem && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {activeProblem.challengeId || activeProblem.projectId}
                  </span>
                  <span className="text-xs font-bold text-[#007A61] flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{activeProblem.universityName || 'University'}</span>
                  </span>
                </div>
                <h5 className="text-sm font-black text-slate-900">{activeProblem.title}</h5>
                <p className="text-xs text-slate-700 italic font-medium">"{activeProblem.problemStatement}"</p>
                <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-600">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeProblem.studentTeam || 'Student Team'}</span>
                  </span>
                  {activeProblem.leadMentor && (
                    <span>Lead Mentor: <strong className="text-slate-800">{activeProblem.leadMentor}</strong></span>
                  )}
                </div>
                {activeProblem.pdfUrl && (
                  <div className="pt-2">
                    <a
                      href={getPdfViewUrl(activeProblem.pdfUrl, activeProblem.pdfName || 'Blueprint.pdf')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>View Prototype Blueprint PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Currently Mentored Problems */}
      <IndustryAssignedProblemsList
        assignedList={assignedList}
        onUnassign={handleUnassign}
        isSubmitting={isSubmitting}
      />
    </FullPageDetailPanel>
  );
};

export default IndustryAssignProblemPanel;
