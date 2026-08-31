import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export const ProfileModalFooter = ({
  isSaving,
  error,
  successMsg,
  onClose
}) => {
  return (
    <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
      <div className="text-xs">
        {error && <span className="text-rose-600 font-bold">{error}</span>}
        {successMsg && <span className="text-emerald-700 font-bold">{successMsg}</span>}
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModalFooter;
