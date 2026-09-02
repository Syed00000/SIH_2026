import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Loader2,
  Download,
  Users,
  AlertTriangle,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { exportChallengeDossierPdf } from '../../../shared/utils/pdfExport.js';
import defaultRoadImg from '../assets/road_challenge.jpg';

export const CitizenChallengeDetailModal = ({ challenge, isOpen, onClose, onChallengeUpdated }) => {
  if (!isOpen || !challenge) return null;

  const chlId = challenge.challengeId || challenge.id || 'CHL-JH-2026-1048';
  const assignedUni = challenge.assignedUniversity || {};
  const [localStatus, setLocalStatus] = useState(challenge.status || 'Under Review');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

  const isResolved = localStatus === 'Resolved';
  const isWithdrawn = localStatus === 'Withdrawn';
  const isAssigned =
    Boolean(assignedUni.name || assignedUni.id) ||
    challenge.status === 'In Progress' ||
    challenge.status === 'Accepted' ||
    challenge.acceptanceStatus === 'Accepted';
  const isAccepted = (assignedUni.acceptanceStatus || challenge.acceptanceStatus) === 'Accepted';
  const isDeclined = (assignedUni.acceptanceStatus || challenge.acceptanceStatus) === 'Declined';
  const canWithdraw = !isResolved && !isWithdrawn && !isAssigned && !showWithdrawConfirm && !showDeleteConfirm;

  const handleWithdraw = async () => {
    setIsProcessing(true);
    setActionError('');
    try {
      await citizenService.withdrawChallenge(chlId, withdrawReason || 'Withdrawn by citizen submitter');
      setLocalStatus('Withdrawn');
      setShowWithdrawConfirm(false);
      if (onChallengeUpdated) onChallengeUpdated();
    } catch (err) {
      setActionError(err.message || 'Failed to withdraw problem statement.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setActionError('');
    try {
      await citizenService.deleteChallenge(chlId);
      setShowDeleteConfirm(false);
      if (onChallengeUpdated) onChallengeUpdated();
      onClose();
    } catch (err) {
      setActionError(err.message || 'Failed to delete problem statement.');
    } finally {
      setIsProcessing(false);
    }
  };

  const milestones = challenge.milestones || [
    {
      step: 1,
      title: 'Problem Submitted',
      description: 'Problem statement filed with location & citizen verification.',
      status: 'COMPLETED',
      updatedBy: 'Citizen Submission Portal',
      remarks: 'Citizen submission acknowledged.',
      completedAt: challenge.submittedAt || new Date().toISOString()
    },
    {
      step: 2,
      title: 'Under Review',
      description: 'Government nodal team evaluating problem scope and severity.',
      status: challenge.status === 'Submitted' ? 'PENDING' : 'CURRENT',
      updatedBy: 'Jharkhand State Innovation Cell',
      remarks: 'Initial screening underway.',
      completedAt: null
    },
    {
      step: 3,
      title: 'University / HEI Assigned',
      description: 'Assigned to relevant university research lab & mentor.',
      status: assignedUni.name ? (isAccepted ? 'COMPLETED' : 'CURRENT') : 'PENDING',
      updatedBy: assignedUni.name || 'Higher & Technical Education',
      remarks: isAccepted ? `Accepted by ${assignedUni.name}` : 'Awaiting confirmation',
      completedAt: null
    },
    {
      step: 4,
      title: 'Prototype & Solution Development',
      description: 'Faculty mentors and student innovators building targeted solution.',
      status: challenge.status === 'In Progress' ? 'CURRENT' : 'PENDING',
      updatedBy: 'R&D Innovation Lab',
      remarks: 'Engineering and field validation phase',
      completedAt: null
    },
    {
      step: 5,
      title: 'Field Deployment & Resolved',
      description: 'Solution deployed on-ground with societal impact verification.',
      status: challenge.status === 'Resolved' ? 'COMPLETED' : 'PENDING',
      updatedBy: 'District Nodal Officer',
      remarks: 'Final impact assessment completed',
      completedAt: challenge.resolvedAt || null
    }
  ];

  const handleDownloadDossier = () => {
    try {
      exportChallengeDossierPdf({ ...challenge, status: localStatus });
    } catch {
      window.print();
    }
  };

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '29 Aug 2026';

  const affectedPop = challenge.impactMetrics?.affectedPopulation || challenge.affectedPopulation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[80vh] overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200/90 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-xs font-bold text-emerald-950">
              {chlId}
            </span>
            <span className="text-xs font-bold text-slate-500 truncate border-l border-slate-300 pl-3">
              {challenge.domain || 'Urban Development'}
            </span>
            <span className={`text-[11px] font-extrabold border-l border-slate-300 pl-3 ${
              isWithdrawn ? 'text-slate-700' : isResolved ? 'text-emerald-800' : 'text-amber-800'
            }`}>
              {localStatus}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Delete confirmation card */}
          {showDeleteConfirm && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-start space-x-2.5 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-slate-900">Permanently Delete This Problem?</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    This will permanently remove <strong>{chlId}</strong> from your records and the system. This action cannot be undone.
                  </p>
                </div>
              </div>

              {actionError && (
                <p className="text-xs text-rose-600 font-bold">{actionError}</p>
              )}

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Withdrawal confirmation box if triggered */}
          {showWithdrawConfirm && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-start space-x-2.5 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-slate-900">Withdraw this Problem Statement?</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Withdrawing will cancel review and mark this problem as withdrawn. You will also be able to delete it.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Reason for withdrawal (Optional):
                </label>
                <input
                  type="text"
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  placeholder="e.g., Resolved locally, duplicate report, no longer relevant..."
                  className="w-full text-xs p-2.5 bg-white rounded-lg border border-rose-200 text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              {actionError && (
                <p className="text-xs text-rose-600 font-bold">{actionError}</p>
              )}

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowWithdrawConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleWithdraw}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Withdrawing...</span>
                    </>
                  ) : (
                    <span>Yes, Withdraw Problem</span>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {challenge.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {challenge.location?.district || challenge.district || 'Ranchi'}, Jharkhand
                  {challenge.location?.block ? ` (${challenge.location.block})` : ''}
                </span>
              </span>

              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{formattedDate}</span>
              </span>

              {affectedPop && (
                <span className="flex items-center space-x-1.5 text-emerald-900 font-semibold text-[11px]">
                  <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{affectedPop}</span>
                </span>
              )}
            </div>
          </div>

          {/* Issue Photo */}
          {(challenge.mediaUrls?.[0]?.url || challenge.image) && (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs max-h-48">
              <img
                src={challenge.mediaUrls?.[0]?.url || challenge.image || defaultRoadImg}
                alt="Problem snapshot"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultRoadImg;
                }}
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Problem Description
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {challenge.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Assigned University */}
          {assignedUni.name && !isWithdrawn && (
            <div className="space-y-2 text-xs mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
                  <Building className="w-4 h-4 text-[#047857]" />
                  <span>Assigned University (HEI)</span>
                </div>
                <span className={`text-[10.5px] font-extrabold ${
                  isAccepted
                    ? 'text-emerald-800'
                    : isDeclined
                    ? 'text-rose-800'
                    : 'text-amber-800'
                }`}>
                  {isAccepted ? 'Accepted' : isDeclined ? 'Declined' : 'Pending Review'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10.5px] block font-medium">Institution</span>
                  <span className="font-bold text-slate-900">{assignedUni.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10.5px] block font-medium">Department</span>
                  <span className="font-bold text-slate-900">{assignedUni.department || 'Innovation Lab'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Milestone Status Tracker */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Resolution Progress Timeline
              </span>
              <span className="text-[11px] font-semibold text-slate-400">5 Stages</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-4 shadow-2xs">
              {milestones.map((ms, idx) => {
                const isCompleted = ms.status === 'COMPLETED';
                const isCurrent = ms.status === 'CURRENT';

                return (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-3 relative animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${idx * 200}ms`, animationFillMode: 'both' }}
                  >
                    {idx < milestones.length - 1 && (
                      <div
                        className={`absolute left-[13px] top-[26px] bottom-[-16px] w-[2px] ${
                          isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#047857] text-white shadow-sm ring-4 ring-emerald-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <span>{ms.step || idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                          {ms.title}
                        </h4>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-700 font-bold">
                            Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span>In Progress</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-medium">{ms.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/90 flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleDownloadDossier}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#047857]" />
              <span className="whitespace-nowrap">Download Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-white text-black border border-slate-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 font-bold rounded-xl shadow-2xs transition-colors cursor-pointer text-xs"
            >
              Close
            </button>
          </div>

          {/* Action Context / Status Notes below buttons to prevent awkward wrapping */}
          <div className="flex flex-wrap items-center gap-2">
            {canWithdraw && (
              <button
                type="button"
                onClick={() => setShowWithdrawConfirm(true)}
                className="px-3 py-1.5 border border-amber-200 text-amber-800 hover:bg-amber-50 font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs text-[11px]"
                title="Withdraw this problem statement"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Withdraw Problem</span>
              </button>
            )}

            {isAssigned && !isResolved && !isWithdrawn && (
              <span className="text-[11px] font-semibold text-emerald-800 w-full sm:w-auto text-center" title="Assigned problems cannot be withdrawn">
                Assigned to HEI (Cannot Withdraw)
              </span>
            )}

            {isWithdrawn && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs text-[11px]"
                title="Permanently delete this withdrawn problem"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Problem</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenChallengeDetailModal;
