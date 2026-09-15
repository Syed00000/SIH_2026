import React, { useState, useEffect } from 'react';
import { X, FileCheck, IndianRupee, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { openPdf } from '../../../../shared/utils/openPdf.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const BudgetApprovalModal = ({ isOpen, onClose, project, onApprove }) => {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateGrantsTotal, setStateGrantsTotal] = useState(0);
  const [loadingPool, setLoadingPool] = useState(true);
  const [error, setError] = useState('');

  const actualAmount = project?.actualBudget?.amount || 0;
  const officerName = project?.assignedBudgetOfficer?.name || 'Officer';

  useEffect(() => {
    if (isOpen) {
      setLoadingPool(true);
      setError('');
      apiClient.get('government/funds')
        .then((res) => {
          const data = res?.data?.data || res?.data || {};
          setStateGrantsTotal(Number(data.stateGrantsTotal) || 0);
        })
        .catch(() => setStateGrantsTotal(0))
        .finally(() => setLoadingPool(false));
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const hasInsufficient = !loadingPool && stateGrantsTotal < actualAmount;

  const handleApprove = async (e) => {
    e.preventDefault();
    if (hasInsufficient) {
      return setError(`Insufficient funds in State Grants pool. Available: ₹${stateGrantsTotal.toLocaleString('en-IN')}, Required: ₹${actualAmount.toLocaleString('en-IN')}`);
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onApprove(remarks);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to sanction department budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Approve Department Budget</h2>
              <p className="text-[11px] font-mono text-emerald-400 font-bold">{project.challengeId || 'PRJ'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">{error}</div>}

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">{project.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{project.description || project.problemStatement}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requested Amount</span>
              <span className="text-2xl font-black text-[#007A61] flex items-center font-mono">
                <IndianRupee className="w-5 h-5 mr-0.5" />{actualAmount.toLocaleString('en-IN')}
              </span>
            </div>
            {project.actualBudget?.details && (
              <div className="pt-2 border-t border-slate-200">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Purpose & Required Resources</span>
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-medium whitespace-pre-wrap max-h-24 overflow-y-auto">
                  {project.actualBudget.details}
                </p>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Prepared By</span>
                <span className="font-bold text-slate-800">{officerName}</span>
              </div>
              {project.actualBudget?.pdfUrl && (
                <button type="button" onClick={() => openPdf(project.actualBudget.pdfUrl)} className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 cursor-pointer">
                  <FileText className="w-3.5 h-3.5" /> View Quotation PDF
                </button>
              )}
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${hasInsufficient ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50/70 border-emerald-200'}`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available State Grants Pool</span>
              <span className="text-sm font-black font-mono text-slate-900">
                {loadingPool ? 'Checking balance...' : `₹ ${stateGrantsTotal.toLocaleString('en-IN')}`}
              </span>
            </div>
            {!loadingPool && (
              <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border ${hasInsufficient ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-[#007A61] border-emerald-300'}`}>
                {hasInsufficient ? <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />}
                <span>{hasInsufficient ? 'Insufficient Balance' : 'Sufficient Balance'}</span>
              </span>
            )}
          </div>

          {hasInsufficient && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Cannot Sanction: Low Government State Grants Pool</strong>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Available is ₹{stateGrantsTotal.toLocaleString('en-IN')}, but requested is ₹{actualAmount.toLocaleString('en-IN')}. Please allocate funds to State Grants under the <strong>CSR Grants</strong> tab before approving.
                </p>
              </div>
            </div>
          )}

          {!hasInsufficient && !loadingPool && (
            <div className="bg-[#007A61]/5 border border-[#007A61]/20 rounded-xl p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#007A61] mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Fund Disbursement & Transfer</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Approving this budget will sanction ₹{actualAmount.toLocaleString('en-IN')}, deduct it from the Government State Grants pool, and credit it directly to the department's fund pool.
                </p>
              </div>
            </div>
          )}

          <form id="approveForm" onSubmit={handleApprove} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Approval Remarks / Notes (Optional)</label>
            <textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="E.g., Approved from State R&D Grants Pool..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-[#007A61] resize-none" />
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer">Cancel</button>
          <button
            type="submit" form="approveForm"
            disabled={isSubmitting || hasInsufficient || loadingPool}
            className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all ${hasInsufficient ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#007A61] hover:bg-[#00604c]'}`}
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
            <span>{hasInsufficient ? 'Insufficient State Pool' : 'Sanction & Approve Budget'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetApprovalModal;
