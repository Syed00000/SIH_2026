import React, { useState } from 'react';
import { X, Check, HelpCircle, AlertOctagon, UserPlus } from 'lucide-react';

export const ChallengeActionModal = ({
  isOpen,
  type = 'accept', // 'accept' | 'clarify' | 'decline' | 'assign'
  challenge,
  facultyList = [
    { name: 'Dr. Priya Sharma', department: 'Environmental Sciences & Water', match: '95%' },
    { name: 'Dr. Arvind Kumar', department: 'Computer Science & AI', match: '90%' },
    { name: 'Prof. S. N. Soren', department: 'Civil & Rural Infrastructure', match: '92%' },
    { name: 'Dr. Neha Verma', department: 'Renewable Energy & Solar PV', match: '88%' }
  ],
  onClose,
  onSubmit
}) => {
  const [remarks, setRemarks] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(facultyList[0]?.name || '');
  const [declineReason, setDeclineReason] = useState('Laboratory instrumentation outside institute scope');

  if (!isOpen || !challenge) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'accept') {
      onSubmit({ type: 'accept', challengeId: challenge.id });
    } else if (type === 'clarify') {
      onSubmit({ type: 'clarify', challengeId: challenge.id, query: remarks });
    } else if (type === 'decline') {
      onSubmit({ type: 'decline', challengeId: challenge.id, reason: declineReason, remarks });
    } else if (type === 'assign') {
      const fac = facultyList.find((f) => f.name === selectedFaculty) || facultyList[0];
      onSubmit({ type: 'assign', challengeId: challenge.id, facultyName: fac.name, department: fac.department });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-xs text-slate-900">{challenge.id}</span>
            <span className="text-xs font-bold text-slate-700">
              {type === 'accept' && '• Accept Grassroots Challenge'}
              {type === 'clarify' && '• Request Technical Clarification'}
              {type === 'decline' && '• Decline Institutional Challenge'}
              {type === 'assign' && '• Assign Faculty Mentor'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{challenge.title}</h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">District: {challenge.district} • Domain: {challenge.domain}</p>
          </div>

          {type === 'accept' && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                By accepting this challenge, the university agrees to onboard multidisciplinary student teams and allocate departmental mentor supervision.
              </p>
            </div>
          )}

          {type === 'clarify' && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 block">Clarification Details for Government Triage:</label>
              <textarea
                required
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Specify required data (e.g., historical water testing records, borehole depths, GPS validation)..."
                className="w-full p-2 bg-white border border-slate-200 rounded-none text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-hidden"
              />
            </div>
          )}

          {type === 'decline' && (
            <div className="space-y-2">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Reason for Decline:</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
                >
                  <option value="Laboratory instrumentation outside institute scope">Laboratory instrumentation outside institute scope</option>
                  <option value="Faculty mentoring capacity currently saturated">Faculty mentoring capacity currently saturated</option>
                  <option value="Request re-routing to agricultural university (BAU)">Request re-routing to agricultural university (BAU)</option>
                  <option value="Duplicate problem already addressed in district">Duplicate problem already addressed in district</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Remarks for Nodal Officer <span className="text-rose-600 font-bold">*</span>:
                </label>
                <textarea
                  required
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Type mandatory comments/reasons to enable decline..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-none text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
                {!remarks.trim() && (
                  <p className="text-[10px] text-rose-600 mt-1 font-medium">
                    * Please enter a comment above to enable the Confirm Decline button.
                  </p>
                )}
              </div>
            </div>
          )}

          {type === 'assign' && (
            <div className="space-y-2">
              <label className="font-bold text-slate-900 block">Select Faculty Mentor:</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {facultyList.map((f) => (
                  <label
                    key={f.name}
                    className={`flex items-center justify-between p-2 border cursor-pointer ${
                      selectedFaculty === f.name ? 'border-slate-900 bg-slate-50 font-bold' : 'border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="faculty"
                        checked={selectedFaculty === f.name}
                        onChange={() => setSelectedFaculty(f.name)}
                      />
                      <div>
                        <div className="text-xs text-slate-900">{f.name}</div>
                        <div className="text-[10px] text-slate-500">{f.department}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                      {f.match} Match
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim())}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-none shadow-xs transition-colors ${
                (type === 'decline' && !remarks.trim()) || (type === 'clarify' && !remarks.trim())
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-slate-900 hover:bg-black text-white cursor-pointer'
              }`}
            >
              {type === 'accept' && 'Confirm Acceptance'}
              {type === 'clarify' && 'Send Clarification'}
              {type === 'decline' && 'Confirm Decline'}
              {type === 'assign' && 'Assign Mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeActionModal;
