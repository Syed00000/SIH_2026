import React from 'react';
import { Trash2, UserPlus, Loader2 } from 'lucide-react';

export const DrawerFooterActions = ({
  isAvailable,
  onAssignChallenge,
  faculty,
  isDeleting,
  handleDelete
}) => {
  return (
    <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
      <button
        type="button"
        disabled={isDeleting}
        onClick={handleDelete}
        className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-1 cursor-pointer"
      >
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        <span>Remove</span>
      </button>

      {isAvailable && onAssignChallenge && (
        <button
          type="button"
          onClick={() => onAssignChallenge(faculty)}
          className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Assign to Challenge</span>
        </button>
      )}
    </div>
  );
};

export default DrawerFooterActions;
