import React from 'react';
import { Send, CheckCircle2, Save, Trash2, Lock, Clock, Sparkles } from 'lucide-react';

export const PrototypeSidebarActions = ({
  timeline,
  setTimeline,
  phases,
  phaseData,
  isLocked,
  saving,
  saveSuccess,
  submitting,
  success,
  hasAnyContent,
  needsChanges,
  isRejected,
  currentStatus,
  onSaveDraft,
  onSubmit,
  onDeleteDraft
}) => {
  const isContentAvailable = typeof hasAnyContent === 'function' ? hasAnyContent() : Boolean(hasAnyContent);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs space-y-3 text-left">
        <label className="text-[10.5px] font-extrabold text-slate-700 uppercase tracking-wider block">
          Target Prototyping Timeline
        </label>
        <div className="relative">
          <input
            type="text"
            disabled={isLocked}
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 4 Weeks (Deployment in Seismic Zone)"
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] disabled:opacity-60"
          />
          <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs space-y-3 text-left">
        <h4 className="text-[10.5px] font-extrabold text-slate-700 uppercase tracking-wider">
          Technical Submission Checklist
        </h4>
        <div className="space-y-2">
          {phases.map((p, idx) => {
            const hasData = Boolean(phaseData[p.key] && phaseData[p.key].replace(/<[^>]*>/g, '').trim().length > 0);
            return (
              <div key={p.key} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                <span className="text-slate-600 font-semibold">{idx + 1}. {p.label}</span>
                {hasData ? (
                  <span className="text-[10px] font-extrabold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 space-y-2">
          {!isLocked && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving || submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-2 border bg-white border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-50 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
                  <span>Draft Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Progress Draft</span>
                </>
              )}
            </button>
          )}

          {!isLocked && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting || saving || !isContentAvailable}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#00604c] text-white transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-emerald-300 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sent to University!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{needsChanges || isRejected ? 'Resubmit to University' : 'Send Prototype to University'}</span>
                </>
              )}
            </button>
          )}

          {!isLocked && hasAnyContent() && (
            <button
              type="button"
              onClick={onDeleteDraft}
              disabled={saving || submitting}
              className="w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-2 border bg-white border-rose-200 hover:bg-rose-50 text-rose-600 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Draft</span>
            </button>
          )}

          {isLocked && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <Lock className="w-4 h-4 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                {currentStatus === 'Approved' ? 'Blueprint Approved' : 'Prototype Sent to University'}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentStatus === 'Approved'
                  ? 'Prototype dossier approved by university committee.'
                  : 'Prototype is under evaluation by university technical review committee.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeSidebarActions;
