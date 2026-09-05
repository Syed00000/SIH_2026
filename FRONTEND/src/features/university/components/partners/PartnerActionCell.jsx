import React from 'react';
import { Eye, Send, Lock, Clock, IndianRupee, XCircle } from 'lucide-react';

export const PartnerActionCell = ({
  partner,
  prototype,
  request,
  onSelectPartner,
  onOpenSendRequest,
  onApproveAmount
}) => {
  const isAccepted = request?.quoteStatus === 'Accepted' || (request?.status === 'Approved' && !request?.labChargesQuoted);
  const isDeclined = request?.quoteStatus === 'Declined' || request?.status === 'Fee Declined';
  const hasPendingAmount = Boolean(request?.labChargesQuoted) && !isAccepted && !isDeclined;

  return (
    <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => onSelectPartner(partner, prototype)}
        title="View Profile Dossier & Prototype"
        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </button>

      {isAccepted ? (
        <div
          title="Industry Fee Accepted & Locked by University"
          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center space-x-1.5 cursor-default shadow-2xs select-none"
        >
          <Lock className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Approved from University</span>
        </div>
      ) : hasPendingAmount ? (
        <button
          type="button"
          onClick={() => onApproveAmount && onApproveAmount(partner, request)}
          title="Review and accept laboratory fee requested by industry"
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-black transition-all shadow-md cursor-pointer flex items-center space-x-1.5 animate-pulse"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Review Fee: {request.labChargesQuoted}</span>
        </button>
      ) : isDeclined ? (
        <button
          type="button"
          onClick={() => onApproveAmount && onApproveAmount(partner, request)}
          title={request.declineReason ? `Declined Reason: ${request.declineReason}` : 'Fee Declined by University'}
          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Fee Declined</span>
        </button>
      ) : request?.status === 'Pending' ? (
        <div
          title="Partnership Request Submitted & Awaiting Industry Approval"
          className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-default shadow-2xs select-none"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Request Sent</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpenSendRequest && onOpenSendRequest(partner, prototype)}
          title="Initiate Partnership / Request CSR"
          className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Request</span>
        </button>
      )}
    </div>
  );
};

export default PartnerActionCell;
