import React from 'react';
import { RotateCcw, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const PrototypeApprovalActions = ({
  approval,
  remarks,
  setRemarks,
  isProcessing,
  isForwarding,
  forwarded,
  onRequestReview,
  onSendToGovernment,
  onClose
}) => {
  const isPending = approval.status === 'Pending' || approval.status === 'Changes Required';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      {/* Status indicator on left */}
      <div className="flex items-center space-x-2 text-xs">
        {forwarded || approval.sentToGovernment ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Forwarded to Government (DHTE) — Under State Evaluation</span>
          </span>
        ) : approval.status === 'Changes Required' ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review & Revision</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Lab Tested — Awaiting University & State Action</span>
          </span>
        )}
      </div>

      {/* Action buttons on right */}
      <div className="flex items-center space-x-2 justify-end">
        {isPending ? (
          <>
            {/* OPTION 1: Request Review */}
            <button
              type="button"
              onClick={onRequestReview}
              disabled={isProcessing || isForwarding}
              className="px-4 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer hover:shadow-xs disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Request Review</span>
            </button>

            {/* OPTION 2: Send to Government */}
            <button
              type="button"
              onClick={onSendToGovernment}
              disabled={isProcessing || isForwarding}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer hover:shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>{isForwarding ? 'Forwarding to DHTE...' : 'Send to Government'}</span>
            </button>
          </>
        ) : (
          <>
            {(forwarded || approval.sentToGovernment) && (
              <button
                type="button"
                onClick={onSendToGovernment}
                disabled={isForwarding}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Resync with Government</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrototypeApprovalActions;
