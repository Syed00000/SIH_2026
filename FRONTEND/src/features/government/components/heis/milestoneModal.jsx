import React from 'react';
import { X } from 'lucide-react';

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
      {/* Milestone Review Modal */}
      {reviewType === 'milestone' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Review Milestone Submission</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">Project: {selectedRecord.id} — {selectedRecord.title}</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed font-medium">
              <p><strong>HEI Submitter</strong>: {selectedRecord.hei}</p>
              <p><strong>Milestone Type</strong>: {selectedRecord.type} (Submitted On: {selectedRecord.date})</p>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Feedback Remarks / Comments <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Enter details comments to approve or request changes back to the university..."
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 resize-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => submitMilestoneAction('Rejected')}
                className="px-3 py-1.8 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold border border-red-100 transition-colors cursor-pointer text-[10px]"
              >
                Reject & Close
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => submitMilestoneAction('Changes Requested')}
                  className="px-3 py-1.8 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => submitMilestoneAction('Approved')}
                  className="px-4 py-1.8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Approve Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestone View popup */}
      {reviewType === 'milestone-view' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Milestone Details & Audit</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">Project: {selectedRecord.id}</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed font-medium text-slate-600">
              <p><strong>Title</strong>: {selectedRecord.title}</p>
              <p><strong>Assigned HEI</strong>: {selectedRecord.hei}</p>
              <p><strong>Milestone Stage</strong>: {selectedRecord.type} (Date: {selectedRecord.date})</p>
              <p><strong>Current Status</strong>: <span className="font-bold text-emerald-600">{selectedRecord.status}</span></p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9.5px] text-slate-400 font-bold block uppercase mb-1">Status Verification Details</span>
                <span>The milestone evaluation report has been reviewed and verified by super admin. Academic credits have been credited to the nodal department and respective project teams.</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.8 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
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
