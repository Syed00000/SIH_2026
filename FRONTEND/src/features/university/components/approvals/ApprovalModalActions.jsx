import React from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { PrototypeApprovalActions } from './PrototypeApprovalActions.jsx';

export const ApprovalModalActions = ({
  approval,
  remarks,
  setRemarks,
  isProcessing,
  isForwarding,
  forwarded,
  canAct,
  handleAction,
  onRequestChanges,
  onReject,
  onApprove,
  onDelete,
  handleSendToGovernment,
  handleClose,
  onClose
}) => {
  return (
    <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      {approval.type === 'Prototype Approval' ? (
        <PrototypeApprovalActions
          approval={approval}
          remarks={remarks}
          setRemarks={setRemarks}
          isProcessing={isProcessing}
          isForwarding={isForwarding}
          forwarded={forwarded}
          onRequestReview={() => handleAction(onRequestChanges)}
          onSendToGovernment={handleSendToGovernment}
          onClose={handleClose}
        />
      ) : (
        <>
          <div className="text-xs text-slate-500">Current Status: <strong>{approval.status}</strong></div>
          {canAct ? (
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleAction(onReject, 'Rejected')}
                disabled={isProcessing}
                className="px-4 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Reject</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction(onRequestChanges, 'Changes Required')}
                disabled={isProcessing}
                className="px-4 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Request Revision</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction(onApprove, 'Approved')}
                disabled={isProcessing}
                className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{isProcessing ? 'Approving & Forwarding...' : 'Approve & Forward to Government'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {approval.status !== 'Pending' && (
                <button
                  type="button"
                  onClick={() => onDelete(approval)}
                  className="px-4 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Delete Record</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovalModalActions;
