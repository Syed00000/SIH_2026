import React from 'react';
import {
  X,
  FileCheck2,
  Building2,
  Calendar,
  Layers,
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  Check
} from 'lucide-react';

export const MilestoneModal = ({
  selectedRecord,
  reviewType,
  setSelectedRecord,
  adminRemarks,
  setAdminRemarks,
  submitMilestoneAction
}) => {
  if (!selectedRecord) return null;

  return (
    <>
      {/* 1. Milestone Action & Review Modal */}
      {reviewType === 'milestone' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 select-none overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh]">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <FileCheck2 className="w-4 h-4 text-slate-900 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                      Review Milestone Submission
                    </h3>
                    <span className="font-mono text-[10.5px] font-bold text-slate-500">
                      ({selectedRecord.id})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {selectedRecord.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer shrink-0 ml-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Submission Overview Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] block uppercase">Submitter HEI</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{selectedRecord.hei}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] block uppercase">Milestone Stage</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1 truncate">
                    <Layers className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{selectedRecord.type}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] block uppercase">Submitted On</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{selectedRecord.date}</span>
                  </span>
                </div>
              </div>

              {/* Submitted Deliverables / Proof Attachments */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 text-xs block">Submitted Deliverables</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate text-[11.5px]">Technical_Report_v2.pdf</p>
                        <p className="text-[10px] text-slate-400">2.4 MB &bull; Verified Format</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate text-[11.5px]">Lab_Test_Results_Signed.pdf</p>
                        <p className="text-[10px] text-slate-400">1.8 MB &bull; Signed Copy</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback Remarks / Directives */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-900 text-xs block">
                  Evaluation Feedback & Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter detailed evaluation comments, compliance notes, or next-step directives for the research team..."
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-medium text-slate-900 text-xs transition-all shadow-2xs resize-none"
                />
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => submitMilestoneAction('Rejected')}
                className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-md font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Reject & Close
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => submitMilestoneAction('Changes Requested')}
                  className="px-3.5 py-1.5 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => submitMilestoneAction('Approved')}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Milestone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Milestone View & Verification Details Modal */}
      {reviewType === 'milestone-view' && (
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
                onClick={() => setSelectedRecord(null)}
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
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-semibold rounded-md text-xs cursor-pointer shadow-xs transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MilestoneModal;
