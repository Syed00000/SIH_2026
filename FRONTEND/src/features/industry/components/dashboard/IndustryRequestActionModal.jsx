import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, Building2, IndianRupee, ShieldCheck, Clock } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

export const IndustryRequestActionModal = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(request?.labChargesQuoted || '₹ 25,000');
  const [quoteTerms, setQuoteTerms] = useState(
    request?.quoteTerms || 'Access to certified research lab, advanced testing apparatus & technician assistance.'
  );

  if (!request) return null;

  const handleAction = async (status) => {
    setIsSubmitting(true);
    try {
      const targetId = request.requestId || request.id;
      const targetCode = request.universityCode || 'RU001';
      const extra = status === 'Approved' ? {
        labChargesQuoted: quoteAmount.trim(),
        quoteTerms: quoteTerms.trim(),
        quoteStatus: 'Pending University Acceptance'
      } : {};
      await universityApiService.updateIndustryRequestStatus(targetId, status, targetCode, extra);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyApproved = request.status === 'Approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-[11px] tracking-wider text-slate-300">COLLABORATION REQUEST</span>
              <h2 className="text-sm font-black text-white">Review Proposal & Quote Lab Charges</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 bg-slate-50 space-y-4 overflow-y-auto flex-1">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 line-clamp-1">{request.title}</h3>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                isAlreadyApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {request.status}
              </span>
            </div>
            <div className="flex items-center text-xs font-semibold text-slate-600">
              <Building2 className="w-4 h-4 mr-1.5 text-[#007A61]" />
              <span>{request.university}</span>
            </div>
            {request.problemStatement && (
              <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
                "{request.problemStatement}"
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Required Support</span>
              <div className="flex flex-wrap gap-1.5">
                {(request.required || 'Testing & Lab').split('+').map((req, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold">
                    {req.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Industry Research Lab Facility & Access Fee Quote *</span>
              </label>
              <p className="text-[11px] text-slate-500 leading-normal">
                Specify the fee your laboratory charges for providing equipment usage, testing space, and technical lab facilities to this university.
              </p>

              {isAlreadyApproved && request.labChargesQuoted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Quoted Lab Fee:</span>
                    <span className="text-sm font-black text-emerald-700">{request.labChargesQuoted}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 italic">{request.quoteTerms}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      placeholder="e.g. ₹ 25,000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={quoteTerms}
                    onChange={(e) => setQuoteTerms(e.target.value)}
                    placeholder="Describe laboratory access, apparatus, and testing terms..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end space-x-2.5 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>
          {!isAlreadyApproved && (
            <>
              <button
                type="button"
                onClick={() => handleAction('Rejected')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleAction('Approved')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Request Lab Fee</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryRequestActionModal;
