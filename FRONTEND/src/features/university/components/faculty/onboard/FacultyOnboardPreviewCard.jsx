import React from 'react';
import { UserCheck, Sparkles, Loader2 } from 'lucide-react';

export const FacultyOnboardPreviewCard = ({
  formData,
  initials,
  specsList,
  loading
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Mentor Directory Card Preview
        </h2>
      </div>

      <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-xs truncate">
              {formData.name || 'Faculty Member Name'}
            </h3>
            <div className="text-[11px] text-slate-600 font-medium truncate">
              {formData.designation} &bull; {formData.department}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
          {specsList.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.name.trim() || !formData.email.trim()}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
        <span>{loading ? 'Creating Faculty Account...' : 'Complete Onboarding & Verify'}</span>
      </button>
    </div>
  );
};

export default FacultyOnboardPreviewCard;
