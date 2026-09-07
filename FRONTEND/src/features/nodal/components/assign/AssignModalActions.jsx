import React from 'react';
import { Send, Trash2, RotateCcw } from 'lucide-react';

export const AssignModalActions = ({
  onClose,
  submitting,
  activeChallenge,
  isConfirmingDelete,
  setIsConfirmingDelete,
  onDeleteChallenge,
  deleting
}) => {
  return (
    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
      <div>
        {activeChallenge && !isConfirmingDelete ? (
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Problem</span>
          </button>
        ) : isConfirmingDelete ? (
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-rose-600">Confirm?</span>
            <button
              type="button"
              onClick={onDeleteChallenge}
              disabled={deleting}
              className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px] font-bold hover:bg-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-3xs"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all"
        >
          {submitting ? (
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>{submitting ? 'Updating...' : 'Save & Synchronize'}</span>
        </button>
      </div>
    </div>
  );
};

export default AssignModalActions;
