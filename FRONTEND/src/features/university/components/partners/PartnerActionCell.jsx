import React from 'react';
import { Eye, Send, CheckCircle2, Clock, IndianRupee, XCircle } from 'lucide-react';

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
    <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => onSelectPartner(partner, prototype)}
        title="View Partner &amp; Prototype Details"
        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </button>

      {isAccepted ? (
        <span
          title="Industry Testing Fee Approved &amp; Locked by University"
          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs select-none cursor-default"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Approved</span>
        </span>
      ) : hasPendingAmount ? (
        <button
          type="button"
          onClick={() => onApproveAmount && onApproveAmount(partner, request)}
          title="Review and approve industry testing fee"
          className="px-3 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Review Fee</span>
        </button>
      ) : isDeclined ? (
        <button
          type="button"
          onClick={() => onApproveAmount && onApproveAmount(partner, request)}
          title={request.declineReason ? `Declined Reason: ${request.declineReason}` : 'Fee Declined by University'}
          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Fee Declined</span>
        </button>
      ) : request?.status === 'Pending' ? (
        <span
          title="Partnership Request Submitted &amp; Awaiting Response"
          className="px-2.5 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs select-none cursor-default"
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Dispatched</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onOpenSendRequest && onOpenSendRequest(partner, prototype)}
          title="Initiate Partnership / Request CSR"
          className="px-3 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Request</span>
        </button>
      )}
    </div>
  );
};

export default PartnerActionCell;
