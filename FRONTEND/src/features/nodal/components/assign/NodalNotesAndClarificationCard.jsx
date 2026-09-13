import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const NodalNotesAndClarificationCard = ({
  nodalRemarks,
  setNodalRemarks
}) => {
  return (
    <div className="space-y-3">

      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
          Nodal Triage Notes & Directives
        </label>
        <textarea
          rows={2}
          placeholder="Enter official evaluation notes, urgency directives, or scope guidelines for the assigned institution..."
          value={nodalRemarks}
          onChange={(e) => setNodalRemarks(e.target.value)}
          className="w-full border border-slate-200 rounded-md p-2 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-slate-900"
        />
      </div>
    </div>
  );
};

export default NodalNotesAndClarificationCard;
