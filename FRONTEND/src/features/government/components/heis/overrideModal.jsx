import React from 'react';
import { X } from 'lucide-react';

export const OverrideModal = ({
  selectedRecord,
  reviewType,
  setSelectedRecord,
  suggestedHeiSelection,
  setSuggestedHeiSelection,
  adminRemarks,
  setAdminRemarks,
  submitOverrideAction
}) => {
  if (!selectedRecord) return null;

  return (
    <>
      {/* Review Modal */}
      {reviewType === 'override' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Review Reassignment Request</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">Problem: {selectedRecord.id} ({selectedRecord.title})</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[9.5px] text-slate-400 font-bold block uppercase">Current HEI</span>
                  <span className="font-bold text-slate-800">{selectedRecord.currentHei}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-500 font-bold block uppercase">Suggested HEI</span>
                  <span className="font-bold text-slate-900">{selectedRecord.suggestedHei}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Allocate Destination</label>
                <select
                  value={suggestedHeiSelection}
                  onChange={(e) => setSuggestedHeiSelection(e.target.value)}
                  className="w-full px-3 py-1.8 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700 cursor-pointer text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="BIT Mesra">BIT Mesra</option>
                  <option value="NIT Jamshedpur">NIT Jamshedpur</option>
                  <option value="Ranchi University">Ranchi University</option>
                  <option value="Kolhan University">Kolhan University</option>
                  <option value="Polytechnic Dhanbad">Polytechnic Dhanbad</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Review remarks / Reason <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Enter detailed reasons for this reassignment approval or rejection..."
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 font-medium text-slate-800 resize-none text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => submitOverrideAction(false)}
                className="px-3.5 py-1.8 border border-red-200 text-red-600 hover:bg-red-50 rounded-md font-bold transition-colors cursor-pointer"
              >
                Decline & Keep Current
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-3.5 py-1.8 border border-slate-200 text-slate-500 rounded-md font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitOverrideAction(true)}
                  className="px-4 py-1.8 bg-slate-900 hover:bg-black text-white rounded-md font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Approve Reassign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View logs Modal */}
      {reviewType === 'override-view' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Assignment Logs & Status</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">Problem: {selectedRecord.id}</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed font-medium text-slate-600">
              <p><strong>Title</strong>: {selectedRecord.title}</p>
              <p><strong>Assigned HEI</strong>: {selectedRecord.currentHei}</p>
              <p><strong>Focus Sector</strong>: {selectedRecord.sector} (District: {selectedRecord.district})</p>
              <p><strong>Status</strong>: <span className="font-bold text-emerald-600">{selectedRecord.status}</span></p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9.5px] text-slate-400 font-bold block uppercase mb-1">Compliance Log</span>
                <span>System allocated this challenge to {selectedRecord.currentHei} based on regional proximity and expertise index. Solutions resolved will accrue credits to participating student teams.</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.8 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default OverrideModal;
