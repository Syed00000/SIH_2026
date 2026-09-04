import React from 'react';
import { Eye, Send, Lock, Clock, CheckCircle2 } from 'lucide-react';

export const PartnerActionCell = ({
  partner,
  request,
  onSelectPartner,
  onOpenSendRequest
}) => {
  const isApproved = request?.status === 'Approved';
  const isPending = request?.status === 'Pending';

  if (isApproved) {
    return (
      <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelectPartner(partner)}
          title="View Approved Partnership & Lab Access Details"
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>

        <div
          title="Collaboration Request Approved by Industry Partner (Lab & R&D Access Granted to University)"
          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center space-x-1.5 cursor-default shadow-2xs select-none"
        >
          <Lock className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Approved from University</span>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelectPartner(partner)}
          title="View Profile Dossier"
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>

        <div
          title="Partnership Request Submitted & Awaiting Industry Approval"
          className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-default shadow-2xs select-none"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Request Sent</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => onSelectPartner(partner)}
        title="View Profile Dossier"
        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>View</span>
      </button>

      <button
        onClick={() => onOpenSendRequest && onOpenSendRequest(partner)}
        title="Initiate Partnership / Request CSR"
        className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Request</span>
      </button>
    </div>
  );
};

export default PartnerActionCell;
