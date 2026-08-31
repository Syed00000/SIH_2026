import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ClearChatPrompt = ({
  clearing,
  onConfirmClear,
  onCancel
}) => {
  return (
    <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs flex items-center justify-between flex-shrink-0 animate-in fade-in">
      <div className="flex items-center space-x-2 text-rose-900 font-bold">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>Are you sure you want to clear all messages in this room?</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onConfirmClear}
          disabled={clearing}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
        >
          {clearing ? 'Clearing...' : 'Clear All'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs border border-slate-300 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClearChatPrompt;
