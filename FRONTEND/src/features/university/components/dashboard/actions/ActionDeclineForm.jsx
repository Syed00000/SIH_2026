import React from 'react';
import { Loader2 } from 'lucide-react';

export const ActionDeclineForm = ({
  declineReason,
  setDeclineReason,
  customReason,
  setCustomReason,
  submitting,
  onBack,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 pt-1">
      <div className="space-y-1.5">
        <label className="block text-xs font-extrabold text-slate-900">
          Select Reason for Declining Allocation:
        </label>
        <select
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61]"
        >
          <option value="Laboratory instrumentation outside institute scope">Laboratory instrumentation outside institute scope</option>
          <option value="Faculty mentoring capacity currently saturated">Faculty mentoring capacity currently saturated</option>
          <option value="Request re-routing to specialized agricultural university (BAU)">Request re-routing to specialized agricultural university (BAU)</option>
          <option value="Outside domain of registered faculties">Outside domain of registered faculties</option>
          <option value="Duplicate problem already addressed in district">Duplicate problem already addressed in district</option>
          <option value="Other">Other (Specify below)</option>
        </select>
      </div>

      {declineReason === 'Other' && (
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700">Detailed Reason:</label>
          <textarea
            required
            rows={2}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Provide justification for State Nodal Cell reallocation..."
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61] resize-none"
          />
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
        >
          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Confirm Decline & Notify Nodal</span>
        </button>
      </div>
    </form>
  );
};

export default ActionDeclineForm;
