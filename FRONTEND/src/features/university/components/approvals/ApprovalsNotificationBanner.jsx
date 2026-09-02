import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, X, Landmark, Bell } from 'lucide-react';

export const ApprovalsNotificationBanner = ({
  pendingCount = 1,
  onFilterPending,
  onDismiss
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || pendingCount <= 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-emerald-300 shadow-2xs select-none animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Top Gov Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#007A61] via-emerald-600 to-amber-500 w-full" />

      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/50 via-white to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side Info */}
        <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-[#007A61] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-700">
            <Landmark className="w-5 h-5 text-emerald-100" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                Government of Jharkhand &bull; HEI Innovation Node
              </span>
              <span className="text-[10.5px] font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                <Bell className="w-3 h-3 text-amber-700" />
                <span>{pendingCount} Proposal Dossier{pendingCount > 1 ? 's' : ''} Awaiting Sanction</span>
              </span>
            </div>

            <div className="mt-1">
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                Official Action Required &bull; Project Proposal & Budget Grant Review
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                Lead Faculty Mentors have submitted innovation methodology & grant sanction requests for University clearance and Government forwarding.
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0 pt-1 md:pt-0">
          {onFilterPending && (
            <button
              type="button"
              onClick={onFilterPending}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer border border-[#00604c]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Review Pending Dossiers</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              if (onDismiss) onDismiss();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsNotificationBanner;
