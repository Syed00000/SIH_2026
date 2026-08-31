import React from 'react';
import { X } from 'lucide-react';

export const UniversityActionModalHeader = ({
  challengeId,
  isAccepted,
  isDeclined,
  onClose
}) => {
  return (
    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-mono font-extrabold text-[#007A61] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
          {challengeId}
        </span>
        <span
          className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
            isAccepted
              ? 'bg-emerald-50 text-[#007A61] border border-emerald-200'
              : isDeclined
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isAccepted ? 'Accepted & Active R&D' : isDeclined ? 'Declined' : 'Pending Institutional Action'}
        </span>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UniversityActionModalHeader;
