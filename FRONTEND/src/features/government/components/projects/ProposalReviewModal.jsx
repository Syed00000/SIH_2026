import React, { useState } from 'react';
import {
  X,
  FileText,
  Building2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  IndianRupee,
  Calendar,
  Layers,
  Award,
  Check,
  XCircle,
  FileCheck
} from 'lucide-react';

export const ProposalReviewModal = ({
  proposal,
  isOpen,
  onClose,
  onApproveGrant,
  onRejectProposal
}) => {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    if (onApproveGrant) {
      onApproveGrant(proposal, remarks);
    }
    setIsProcessing(false);
    onClose();
  };

  const handleReject = () => {
    setIsProcessing(true);
    if (onRejectProposal) {
      onRejectProposal(proposal, remarks);
    }
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-white">
                {proposal.id}
              </span>
              <span className="text-xs font-bold text-slate-500">{proposal.sector}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">{proposal.title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitting HEI</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{proposal.hei}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Team Lead</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{proposal.teamLead}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Requested Grant</span>
              <span className="font-black text-slate-900 mt-0.5 block text-sm">{proposal.requestedGrant}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{proposal.estimatedDuration || '8 Months'}</span>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
              Executive Abstract & Solution Concept
            </h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {proposal.abstract}
            </p>
          </div>

          {/* Problem Statement & Methodology */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Target Problem in Jharkhand
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {proposal.problemStatement}
              </p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                Technical Methodology & Stack
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {proposal.methodology}
              </p>
            </div>
          </div>

          {/* Budget Breakdown Table */}
          {proposal.budgetBreakdown && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                Itemized Grant Budget Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                      <th className="py-2 px-3">Expenditure Line Item</th>
                      <th className="py-2 px-3 text-right">Allocated Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proposal.budgetBreakdown.map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-medium text-slate-800">{b.item}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attached Files Dossier */}
          {proposal.documents && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                Attached Evaluation Dossiers & DPR
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proposal.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 truncate text-[11px]">{doc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 ml-2">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviewer Remarks */}
          <div>
            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1">
              Government Evaluation Remarks / Conditions
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter technical sanction notes, stage conditions, or milestone requirements..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleReject}
              className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Proposal</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApprove}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approve & Sanction Grant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalReviewModal;
