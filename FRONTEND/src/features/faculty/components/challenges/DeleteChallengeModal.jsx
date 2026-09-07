import React from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export const DeleteChallengeModal = ({
  challenge,
  deleting,
  onClose,
  onConfirm
}) => {
  if (!challenge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200/90 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 text-left">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900">Delete Problem Statement</h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {challenge.challengeId || challenge.id}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-800 line-clamp-2">
            "{challenge.title}"
          </p>
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 text-xs text-red-900 leading-relaxed">
            Are you sure you want to delete this problem statement? This will permanently remove it from the system and all allocated lists.
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChallengeModal;
