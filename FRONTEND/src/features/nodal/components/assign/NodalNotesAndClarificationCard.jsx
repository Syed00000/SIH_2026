import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const NodalNotesAndClarificationCard = ({
  verificationStatus,
  nodalRemarks,
  setNodalRemarks,
  clarificationResponse,
  setClarificationResponse
}) => {
  return (
    <div className="space-y-3">
      {verificationStatus === 'Needs Clarification' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1.5">
          <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Clarification Query to Citizen</span>
          </div>
          <textarea
            rows={2}
            placeholder="Specify missing ground evidence, landmark details, or clarification required..."
            value={clarificationResponse}
            onChange={(e) => setClarificationResponse(e.target.value)}
            className="w-full border border-blue-200 rounded-md p-2 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

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
