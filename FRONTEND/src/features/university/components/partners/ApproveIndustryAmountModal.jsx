import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, IndianRupee, Lock, Building2, FileText, AlertCircle } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const ApproveIndustryAmountModal = ({ isOpen, onClose, request, partner, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineBox, setShowDeclineBox] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  if (!isOpen || !request) return null;

  const reqId = request.requestId || request.id;
  const partnerTitle = partner?.name || partner?.legalName || request.partnerName || 'Industry Partner';
  const isAccepted = request.quoteStatus === 'Accepted';
  const isDeclined = request.quoteStatus === 'Declined';
  const isMentorship = request.collaborationPurpose === 'Mentorship' || request.purpose === 'Mentorship' || request.mentorshipRequested;
  const feeAmount = request.labChargesQuoted || '₹ 25,000';

  const handleDecision = async (decision, reason = '') => {
    setIsSubmitting(true);
    try {
      const payload = { quoteStatus: decision, labChargesQuoted: feeAmount };
      if (decision === 'Declined') payload.declineReason = reason;
      const newStatus = decision === 'Accepted' ? 'Approved' : 'Fee Declined';
      await universityApiService.updateIndustryRequestStatus(reqId, newStatus, 'RU001', payload);
      onSuccess && onSuccess(reqId, decision);
      onClose();
    } catch (err) {
      console.error('Failed to update quote decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">Industry Financial Proposal</span>
              <h2 className="text-sm font-black text-white">{isMentorship ? 'Review & Approve Industry Mentorship Fee' : 'Review & Approve Industry Testing Fee'}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 bg-[#fafafa] max-h-[75vh] overflow-y-auto">
          {/* Partner & Project Strip */}
          <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#007A61]" />
                <span className="truncate max-w-[240px]">{partnerTitle}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#007A61] text-[10px] font-black border border-emerald-200">
                {isMentorship ? 'Corporate Mentor' : 'Verified Lab'}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-100">
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block">Project Title</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">{request.projectTitle || request.title}</p>
            </div>
          </div>

          {/* Requested Amount Banner */}
          <div className="p-3.5 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl shadow-inner space-y-1 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">{isMentorship ? 'Requested Technical Mentorship & Guidance Fee' : 'Requested Laboratory Testing Fee'}</span>
            <div className="text-2xl font-black text-[#007A61] tracking-tight">{feeAmount}</div>
            <p className="text-[10.5px] text-emerald-800 font-medium">{isMentorship ? `Requested by ${partnerTitle} for expert guidance & domain consultation.` : `Requested by ${partnerTitle} for apparatus & technician hours.`}</p>
          </div>

          {/* Quote Terms & Scope */}
          <div className="space-y-1">
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>{isMentorship ? 'Mentorship Scope & Consultation Terms' : 'Industry Scope & Facilities Included'}</span>
            </span>
            <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
              "{request.quoteTerms || (isMentorship ? 'Dedicated industry mentorship sessions, architecture reviews, and prototype guidance.' : 'Access to certified research lab, advanced testing apparatus & technician assistance.')}"
            </p>
          </div>

          {/* Government Grant Deduction Notice */}
          <div className="p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-black text-amber-950">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>University Government Grant Deduction Notice</span>
            </div>
            <p className="text-[10.5px] text-amber-800 leading-relaxed font-medium">
              Accepting this fee will deduct <strong>{feeAmount}</strong> from Ranchi University's government grant. {isMentorship ? 'Problem statement will be unlocked for expert mentor assignment in the industry portal.' : 'Project moves to Active Projects and Testing Labs.'}
            </p>
          </div>

          {/* Decline Reason Input Form */}
          {showDeclineBox && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-950 flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mandatory Rejection Reason *</span>
                </span>
                <button type="button" onClick={() => setShowDeclineBox(false)} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 underline cursor-pointer">Cancel</button>
              </div>
              <textarea
                rows={2}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Specify why university is declining this testing fee (e.g. fee quote exceeds allocated grant)..."
                className="w-full text-xs font-medium text-slate-800 p-2 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                disabled={!declineReason.trim() || isSubmitting}
                onClick={() => handleDecision('Declined', declineReason.trim())}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black shadow-xs transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Rejection...' : 'Confirm Rejection & Send to Industry'}</span>
              </button>
            </div>
          )}

          {isAccepted && (
            <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs font-black text-emerald-900">
              <Lock className="w-4 h-4 text-[#007A61]" />
              <span>Lab testing fee accepted. Project is active in Testing &amp; Labs.</span>
            </div>
          )}

          {isDeclined && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl space-y-0.5">
              <span className="text-xs font-black text-rose-900 flex items-center space-x-1"><XCircle className="w-3.5 h-3.5 text-rose-600" /><span>Fee Request Declined</span></span>
              <p className="text-[10.5px] text-rose-800 italic">Reason: "{request.declineReason || 'Budget limit exceeded.'}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">Close</button>
          {isAccepted ? (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#007A61]" /><span>Fee Accepted &amp; Locked</span>
            </div>
          ) : isDeclined ? (
            <div className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" /><span>Fee Declined</span>
            </div>
          ) : !showDeclineBox && (
            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => setShowDeclineBox(true)} disabled={isSubmitting} className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50">Reject / Decline</button>
              <button type="button" onClick={() => handleDecision('Accepted')} disabled={isSubmitting} className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50">
                <CheckCircle2 className="w-4 h-4" /><span>{isSubmitting ? 'Accepting...' : `Accept Fee (${feeAmount}) & Lock`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveIndustryAmountModal;
