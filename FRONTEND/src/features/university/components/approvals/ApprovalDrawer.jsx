import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { ApprovalDrawerHeader } from './ApprovalDrawerHeader.jsx';
import { ApprovalDrawerBody } from './ApprovalDrawerBody.jsx';

export const ApprovalDrawer = ({
  approval,
  onClose,
  onApprove,
  onReject,
  onRequestChanges
}) => {
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setRemarks('');
  }, [approval?.approvalId]);

  if (!approval) return null;

  const canAct = approval.status === 'Pending' || approval.status === 'Changes Required';

  const history = Array.isArray(approval.history) && approval.history.length > 0
    ? approval.history
    : [
        {
          action: 'Proposal Submitted by Faculty',
          performedBy: approval.requestedBy || 'Faculty Mentor',
          timestamp: `${approval.date}, ${approval.dateTime || '10:30 AM'}`,
          note: `Itemized R&D Budget of ${approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'} submitted for review.`
        }
      ];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    onApprove(approval, remarks);
    setRemarks('');
    showToast('Proposal Approved & Forwarded to Government for Grant Sanction.');
  };

  const handleReject = () => {
    onReject(approval, remarks);
    setRemarks('');
    showToast('Proposal rejected.', 'error');
  };

  const handleChanges = () => {
    onRequestChanges(approval, remarks);
    setRemarks('');
    showToast('Revision requested from Faculty Mentor.', 'warn');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all max-h-[85vh]">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-2.5 text-xs font-bold text-center text-white transition-all ${
            toast.type === 'error'
              ? 'bg-rose-600'
              : toast.type === 'warn'
              ? 'bg-amber-600'
              : 'bg-[#007A61]'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <ApprovalDrawerHeader approval={approval} onClose={onClose} />

      {/* Scrollable Body */}
      <ApprovalDrawerBody
        approval={approval}
        remarks={remarks}
        setRemarks={setRemarks}
        history={history}
      />

      {/* Sticky Action Footer */}
      {canAct && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleApprove}
              className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Approve &amp; Forward</span>
            </button>

            <button
              onClick={handleChanges}
              className="py-2.5 px-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Request Revision</span>
            </button>

            <button
              onClick={handleReject}
              className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDrawer;
