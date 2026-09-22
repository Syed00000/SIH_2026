import React from 'react';
import { Minus, X } from 'lucide-react';
import { JoharSetuIcon } from './JoharSetuIcon.jsx';

/**
 * Header component for Johar Setu Assistant modal.
 */
export const AssistantHeader = ({ onMinimize, onClose, onClearChat }) => {
  return (
    <div className="px-4 py-3.5 bg-[#015a3a] text-white flex items-center justify-between border-b border-[#01482e] select-none rounded-t-2xl shadow-xs">
      {/* Brand Profile */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-300/40">
          <JoharSetuIcon className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-sm sm:text-[15px] font-bold tracking-tight text-white leading-tight">
            Johar Setu Assistant
          </h2>
          <p className="text-[11px] text-emerald-100/90 font-normal leading-tight mt-0.5">
            Here to help. For a Better Jharkhand.
          </p>
        </div>
      </div>

      {/* Header Action Controls */}
      <div className="flex items-center space-x-1">
        {onMinimize && (
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize"
            aria-label="Minimize"
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          title="Close"
          aria-label="Close"
          className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default AssistantHeader;
