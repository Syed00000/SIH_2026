import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Building, X, Download, RotateCcw, Trash2, Rocket, FileText, ExternalLink } from 'lucide-react';
import { exportChallengeDossierPdf } from '../../../shared/utils/pdfExport.js';
import { citizenService } from '../services/citizenService.js';
import { CitizenChallengeEvidenceSection } from './detail/CitizenChallengeEvidenceSection.jsx';
import { CitizenTimelineMilestones } from './detail/CitizenTimelineMilestones.jsx';
import { CitizenChallengeActionAlerts } from './detail/CitizenChallengeActionAlerts.jsx';
import { openPdfDocument } from '../../../shared/utils/openPdf.js';

export const CitizenChallengeDetailModal = ({ challenge = null, isOpen, onClose, onChallengeDeleted, onChallengeUpdated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [localStatus, setLocalStatus] = useState(challenge?.status || 'Submitted');

  useEffect(() => {
    if (challenge?.status) setLocalStatus(challenge.status);
  }, [challenge?.status]);

  if (!isOpen || !challenge || Object.keys(challenge).length === 0) return null;

  const safeChallenge = challenge || {};
  const challengeId = safeChallenge.id || safeChallenge._id || safeChallenge.challengeId;
  const isWithdrawn = localStatus === 'Withdrawn';
  const isResolved = localStatus === 'Resolved' || localStatus === 'Deployed';
  const assignedUni = safeChallenge.assignedUniversity || {};
  const isAssigned = Boolean(assignedUni.name || assignedUni.universityName);
  const isAccepted = safeChallenge.assignmentStatus === 'ACCEPTED' || safeChallenge.assignmentStatus === 'Accepted';
  const canWithdraw = !isWithdrawn && !isResolved && !isAssigned;
  const protoPdf = challenge.prototypePdfUrl || challenge.resolutionDossier?.prototypePdfUrl || challenge.solutionPdfUrl;

  const handleWithdraw = async () => {
    setIsProcessing(true);
    setActionError('');
    try {
      await citizenService.withdrawChallenge(challengeId, 'Withdrawn by submitter.');
      setLocalStatus('Withdrawn');
      setShowWithdrawConfirm(false);
      if (onChallengeUpdated) onChallengeUpdated({ ...challenge, status: 'Withdrawn' });
    } catch (err) { setActionError(err.message || 'Failed to withdraw problem.'); }
    finally { setIsProcessing(false); }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setActionError('');
    try {
      await citizenService.deleteChallenge(challengeId);
      if (onChallengeDeleted) onChallengeDeleted(challengeId);
      onClose();
    } catch (err) { setActionError(err.message || 'Failed to delete problem.'); }
    finally { setIsProcessing(false); }
  };

  const milestones = [
    { step: 1, title: 'Problem Submitted', description: 'Filed with location & citizen verification.', status: 'COMPLETED' },
    { step: 2, title: 'Under Review', description: 'Government nodal team evaluating problem scope.', status: challenge.status === 'Submitted' ? 'PENDING' : 'COMPLETED' },
    { step: 3, title: 'University Assigned', description: 'Assigned to relevant university research lab.', status: assignedUni.name ? 'COMPLETED' : 'PENDING' },
    { step: 4, title: 'Solution Development', description: 'Faculty and students building targeted solution.', status: isResolved ? 'COMPLETED' : (challenge.status === 'In Progress' ? 'CURRENT' : 'PENDING') },
    { step: 5, title: 'Field Deployment & Resolved', description: 'Solution deployed on-ground.', status: isResolved ? 'COMPLETED' : 'PENDING' }
  ];

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  const affectedPop = challenge.impactMetrics?.affectedPopulation || challenge.affectedPopulation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{challenge.challengeId || 'CHL'}</span>
            <span className="text-xs font-bold text-slate-500">• {challenge.domain || 'Community'}</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{localStatus}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <CitizenChallengeActionAlerts
            showDeleteConfirm={showDeleteConfirm} setShowDeleteConfirm={setShowDeleteConfirm} handleDelete={handleDelete}
            showWithdrawConfirm={showWithdrawConfirm} setShowWithdrawConfirm={setShowWithdrawConfirm} handleWithdraw={handleWithdraw}
            isProcessing={isProcessing} actionError={actionError}
          />

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{challenge.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center space-x-1.5"><MapPin className="w-4 h-4 text-emerald-700 shrink-0" /><span>{challenge.location?.district || challenge.district || 'Ranchi'}, Jharkhand</span></span>
              <span className="flex items-center space-x-1.5"><Calendar className="w-4 h-4 text-emerald-700 shrink-0" /><span>{formattedDate}</span></span>
              {affectedPop && <span className="flex items-center space-x-1.5 text-emerald-900 font-semibold text-[11px]"><Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" /><span>{affectedPop}</span></span>}
            </div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Problem Description</span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">{challenge.description || 'No description provided.'}</p>
          </div>

          {/* Attached Evidence Section */}
          <CitizenChallengeEvidenceSection challenge={challenge} />

          {/* Deployed Prototype & Resolution Dossier */}
          {protoPdf && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4 text-[#007A61]" />
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    Certified Prototype Deployed On-Ground
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold text-[10px]">
                  SOLVED
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                The State Government and University Research Team have completed lab testing and deployed the operational prototype solution for citizen benefit.
              </p>
              <button
                type="button"
                onClick={() => openPdfDocument(protoPdf, `${challenge.title || 'Prototype'}_Blueprint.pdf`)}
                className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Deployed Prototype PDF</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {assignedUni.name && !isWithdrawn && (
            <div className="space-y-1.5 text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <div className="flex items-center space-x-1.5 text-emerald-950">
                  <Building className="w-4 h-4 text-[#047857]" />
                  <span>Assigned University</span>
                </div>
                <span className="text-[10.5px] text-emerald-800 font-extrabold">{isAccepted ? 'Accepted' : 'Pending Review'}</span>
              </div>
              <div className="text-slate-700 text-xs">
                <span className="font-bold text-slate-900">{assignedUni.name}</span>
                {assignedUni.department && <span className="text-slate-500"> • {assignedUni.department}</span>}
              </div>
            </div>
          )}

          <CitizenTimelineMilestones milestones={milestones} />
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={() => exportChallengeDossierPdf({ ...challenge, status: localStatus })} className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs text-xs cursor-pointer">
              <Download className="w-3.5 h-3.5 text-[#047857]" />
              <span>Download Receipt</span>
            </button>
            {canWithdraw && (
              <button type="button" onClick={() => setShowWithdrawConfirm(true)} className="px-3 py-1.5 border border-amber-200 text-amber-800 hover:bg-amber-50 font-bold rounded-lg flex items-center space-x-1.5 text-[11px] cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Withdraw</span>
              </button>
            )}
            {isWithdrawn && !showDeleteConfirm && (
              <button type="button" onClick={() => setShowDeleteConfirm(true)} className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg flex items-center space-x-1.5 text-[11px] cursor-pointer">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete</span>
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-5 py-2 bg-white text-black border border-slate-200 hover:bg-slate-100 font-bold rounded-xl shadow-2xs text-xs cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenChallengeDetailModal;
