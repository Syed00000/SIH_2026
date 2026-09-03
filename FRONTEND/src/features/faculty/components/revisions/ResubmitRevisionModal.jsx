import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, IndianRupee } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';

export const ResubmitRevisionModal = ({
  item,
  faculty,
  onClose,
  onSuccess
}) => {
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  if (!item) return null;

  const handleConfirmResubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = item.approvalId || item.id;
      const uniCode = faculty?.universityCode || 'RU001';
      const extraVal = Number(extraAmount) || 0;
      
      const prevBudgetVal = Number(String(item.budget || item.estimatedBudget || '80000').replace(/[^\d]/g, '')) || 80000;
      const newTotalBudget = prevBudgetVal + extraVal;
      const newBudgetFormatted = `₹ ${newTotalBudget.toLocaleString('en-IN')}`;

      let updatedBreakdown = item.rawApproval?.budgetBreakdown || [];
      if (extraVal > 0) {
        updatedBreakdown = [
          ...updatedBreakdown,
          {
            category: `Supplemental Revision Allocation (${resubmitNotes.slice(0, 30) || 'Field & Prototype Scale'})`,
            amount: `₹ ${extraVal.toLocaleString('en-IN')}`,
            amountNumber: extraVal
          }
        ];
      }

      await facultyApiService.resubmitRevision(id, uniCode, resubmitNotes, {
        additionalAmount: extraVal,
        proposedBudget: newBudgetFormatted,
        budget: newBudgetFormatted,
        budgetBreakdown: updatedBreakdown
      });

      const pId = item.projectId || id.replace('APP-', '');
      if (pId) {
        await facultyApiService.updateProject(pId, {
          budget: newBudgetFormatted,
          proposedBudget: newBudgetFormatted,
          additionalAmount: extraVal,
          budgetBreakdown: updatedBreakdown,
          adminRemarks: '',
          universityRemarks: '',
          budgetStatus: 'Submitted to University for Review'
        }).catch(() => {});
      }

      setSubmitSuccess(`Revision ${extraVal > 0 ? `with +₹ ${extraVal.toLocaleString('en-IN')} extra grant` : ''} successfully resubmitted to University Authority!`);
      setTimeout(() => {
        setSubmitSuccess(null);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to resubmit revision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200/90 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Resubmit Revised Proposal</h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {item.approvalId || item.projectId}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
          <span className="font-bold text-amber-900 block">Original Authority Remarks:</span>
          <p className="text-amber-950 italic">"{item.adminRemarks}"</p>
        </div>

        <form onSubmit={handleConfirmResubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Faculty Revision Response / Summary of Changes *
            </label>
            <textarea
              value={resubmitNotes}
              onChange={(e) => setResubmitNotes(e.target.value)}
              rows={3}
              required
              placeholder="e.g. Revised line-item budget telemetry allocations and updated methodology as requested by review committee."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Additional Grant Amount Requested (Optional, ₹)</span>
              <span className="text-[10.5px] font-normal text-slate-400">Extra funds needed for this revision</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                value={extraAmount}
                onChange={(e) => setExtraAmount(e.target.value)}
                placeholder="0 (e.g. 15000)"
                className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          {submitSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isSubmitting ? 'Resubmitting...' : 'Confirm & Resubmit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResubmitRevisionModal;
