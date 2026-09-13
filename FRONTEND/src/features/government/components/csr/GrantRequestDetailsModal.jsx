import React from 'react';
import { X, FileText, Landmark, AlertTriangle, CheckCircle2, Clock, Calendar, Printer } from 'lucide-react';

export const GrantRequestDetailsModal = ({ isOpen, onClose, request, onOpenApprove }) => {
  if (!isOpen || !request) return null;

  const reqAmount = Number(request.requestedAmount) || 0;
  const sancAmount = Number(request.sanctionedAmount) || 0;
  const isPending = request.status === 'Pending';
  const isGranted = request.status === 'Granted';
  const isRejected = request.status === 'Rejected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-black text-xs uppercase tracking-wider">Fund Requisition Dossier</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-slate-900">{request.requestId}</span>
              <div className="text-[11px] text-slate-500 font-medium">Requisition Tier: {request.tier || 'DISTRICT_TO_STATE'}</div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
              isGranted ? 'bg-emerald-100 text-[#007A61] border border-emerald-300' :
              isRejected ? 'bg-rose-100 text-rose-700 border border-rose-300' :
              'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {request.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xs border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Requester Department</span>
              <span className="font-black text-slate-900 block text-xs">{request.requesterName}</span>
              <span className="text-[10px] text-slate-500 font-medium">{request.requesterCategory} • {request.district || 'Ranchi'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Target Authority</span>
              <span className="font-bold text-slate-800 block text-xs">{request.targetName}</span>
              <span className="text-[10px] text-slate-500 font-medium">{request.targetCategory}</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#007A61] block">Requested Grant Amount</span>
              <span className="text-xl font-black font-mono text-emerald-950">₹ {reqAmount.toLocaleString('en-IN')}</span>
            </div>
            {isGranted && (
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-[#007A61] block">Sanctioned Amount</span>
                <span className="text-xl font-black font-mono text-[#007A61]">₹ {sancAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Purpose / Problem Statement</span>
              <span className="font-bold text-slate-900">{request.purpose}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Sector / Scheme</span>
              <span className="font-medium text-slate-700">{request.sector || 'Civic Infrastructure'}</span>
            </div>
            {request.justification && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Justification & Utilization Plan</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xs border border-slate-200/80">{request.justification}</p>
              </div>
            )}
            {isGranted && request.utrNumber && (
              <div className="p-2 bg-slate-50 rounded-xs border border-slate-200 text-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sanction Reference / UTR</span>
                <span className="font-mono font-bold text-slate-900">{request.utrNumber}</span>
                {request.grantRemarks && <div className="text-[11px] text-slate-500 italic">"{request.grantRemarks}"</div>}
              </div>
            )}
            {isRejected && request.rejectionReason && (
              <div className="p-2 bg-rose-50 rounded-xs border border-rose-200 text-rose-700">
                <span className="text-[10px] font-bold uppercase text-rose-500 block">Rejection Audit Reason</span>
                <span>{request.rejectionReason}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => window.print()} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /><span>Print Dossier</span>
            </button>
            {isPending && onOpenApprove && (
              <button type="button" onClick={() => { onClose(); onOpenApprove(request); }} className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white font-bold rounded-xs cursor-pointer shadow-xs">
                Approve & Transfer
              </button>
            )}
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xs cursor-pointer">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantRequestDetailsModal;
