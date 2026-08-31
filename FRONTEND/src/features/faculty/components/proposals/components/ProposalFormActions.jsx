import React from 'react';
import { Save, Send, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';

export const ProposalFormActions = ({
  faculty,
  currentProject,
  savingDraft,
  draftSavedSuccess,
  submitting,
  submittedSuccess,
  onSaveDraft
}) => {
  return (
    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
      <div className="text-[11px] text-slate-500">
        Author: <strong>{faculty?.name || 'Lead Mentor'}</strong> ({faculty?.department})
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={savingDraft}
          className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
        >
          {savingDraft ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#007A61]" />
          ) : draftSavedSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
          ) : (
            <Save className="w-4 h-4 text-slate-600" />
          )}
          <span>{draftSavedSuccess ? 'Draft Saved!' : 'Save Draft'}</span>
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : submittedSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : currentProject?.budgetStatus?.includes('Changes Required') ? (
            <RotateCcw className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>
            {submittedSuccess
              ? 'Proposal Submitted to University!'
              : currentProject?.budgetStatus === 'Changes Required by Government'
              ? 'Resubmit Revised Proposal to Government'
              : currentProject?.budgetStatus === 'Changes Required by University'
              ? 'Resubmit Revised Proposal'
              : 'Submit Proposal to University'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProposalFormActions;
