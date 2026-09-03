import React from 'react';
import { AlertCircle, Trash2, RotateCcw, Loader2 } from 'lucide-react';

export const CitizenChallengeActionAlerts = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  showWithdrawConfirm,
  setShowWithdrawConfirm,
  handleWithdraw,
  isProcessing,
  actionError
}) => {
  return (
    <>
      {showDeleteConfirm && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Confirm Permanent Deletion</span>
          </div>
          <p className="text-xs text-rose-700">Are you sure you want to permanently delete this challenge?</p>
          {actionError && <p className="text-xs text-rose-600 font-bold">{actionError}</p>}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleDelete}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center space-x-1.5"
            >
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Yes, Delete</span>}
            </button>
          </div>
        </div>
      )}

      {showWithdrawConfirm && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Confirm Withdrawal</span>
          </div>
          <p className="text-xs text-amber-800">Are you sure you want to withdraw this problem statement?</p>
          {actionError && <p className="text-xs text-rose-600 font-bold">{actionError}</p>}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setShowWithdrawConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleWithdraw}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center space-x-1.5"
            >
              {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Yes, Withdraw</span>}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CitizenChallengeActionAlerts;
