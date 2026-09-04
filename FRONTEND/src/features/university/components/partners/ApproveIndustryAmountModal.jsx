import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, IndianRupee, ShieldCheck, Lock, Building2, FileText, AlertCircle } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const ApproveIndustryAmountModal = ({
  isOpen,
  onClose,
  request,
  partner,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const reqId = request.requestId || request.id;
  const partnerTitle = partner?.name || partner?.legalName || request.partnerName || 'Industry Partner';
  const isAccepted = request.quoteStatus === 'Accepted';
  const isDeclined = request.quoteStatus === 'Declined';
  const feeAmount = request.labChargesQuoted || '₹ 25,000';

  const handleDecision = async (decision) => {
    setIsSubmitting(true);
    try {
      await universityApiService.updateIndustryRequestStatus(reqId, 'Approved', 'RU001', {
        quoteStatus: decision,
        labChargesQuoted: feeAmount
      });
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
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">Industry Financial Proposal</span>
              <h2 className="text-sm font-black text-white">Review & Approve Industry Amount</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 bg-[#fafafa]">
          {/* Partner & Project Strip */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#007A61]" />
                <span className="truncate max-w-[240px]">{partnerTitle}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#007A61] text-[10px] font-black border border-emerald-200">
                Verified Lab
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Project Title</span>
              <p className="text-xs font-black text-slate-900 mt-0.5">{request.projectTitle || request.title}</p>
            </div>
          </div>

          {/* Requested Amount Banner */}
          <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl shadow-inner space-y-1.5 text-center">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-900 block">
              Requested Laboratory Testing Fee
            </span>
            <div className="text-2xl font-black text-[#007A61] tracking-tight">
              {feeAmount}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              Requested by {partnerTitle} for testing apparatus, instrumentation, & technician hours.
            </p>
          </div>

          {/* Quote Terms & Scope */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>Industry Terms & Facilities Included</span>
            </span>
            <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
              "{request.quoteTerms || 'Access to certified research lab, advanced testing apparatus & technician assistance.'}"
            </p>
          </div>

          {isAccepted && (
            <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs font-black text-emerald-900">
              <Lock className="w-4 h-4 text-[#007A61]" />
              <span>Lab testing fee accepted. Project is locked and active in Industry Testing & Labs.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>

          {isAccepted ? (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Fee Accepted & Locked</span>
            </div>
          ) : isDeclined ? (
            <div className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center space-x-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Fee Declined</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleDecision('Declined')}
                disabled={isSubmitting}
                className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50"
              >
                Reject / Decline
              </button>
              <button
                type="button"
                onClick={() => handleDecision('Accepted')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Accepting...' : 'Accept Amount & Lock'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveIndustryAmountModal;
