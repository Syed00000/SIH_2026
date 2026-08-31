import React from 'react';
import { Trash2, Ban } from 'lucide-react';

export const DeleteMessageModal = ({
  deleteModalMsg,
  userRole,
  onExecuteDelete,
  onCancel
}) => {
  if (!deleteModalMsg) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Delete message?</h4>
            <p className="text-[11px] text-slate-500">Choose how you want to remove this message</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-200 line-clamp-2">
          "{deleteModalMsg.message}"
        </div>

        <div className="space-y-2 pt-1">
          {deleteModalMsg.senderRole === userRole && !deleteModalMsg.isDeletedForEveryone && (
            <button
              type="button"
              onClick={() => onExecuteDelete('EVERYONE')}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Delete for everyone</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onExecuteDelete('FOR_ME')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Delete for me</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
