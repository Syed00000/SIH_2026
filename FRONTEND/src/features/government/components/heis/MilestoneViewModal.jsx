import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const MilestoneViewModal = ({ selectedRecord, onClose }) => {
  if (!selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 select-none overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh]">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                Milestone Details & Verification
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Project ID: {selectedRecord.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-2 gap-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-slate-400 font-semibold text-[10px] block uppercase">Project Title</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedRecord.title}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold text-[10px] block uppercase">Assigned HEI</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{selectedRecord.hei}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold text-[10px] block uppercase">Milestone Stage</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{selectedRecord.type}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold text-[10px] block uppercase">Current Status</span>
              <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{selectedRecord.status}</span>
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Evaluation Audit Trail
            </span>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              The milestone evaluation report has been verified by the State Administrator. Academic credits (+120 credits) have been credited to {selectedRecord.hei} under the NEP 2020 framework.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white font-semibold rounded-md text-xs cursor-pointer shadow-xs transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneViewModal;
