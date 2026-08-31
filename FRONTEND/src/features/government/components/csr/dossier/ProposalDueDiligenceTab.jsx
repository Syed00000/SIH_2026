import React from 'react';
import { ShieldCheck, FileCheck2, AlertCircle } from 'lucide-react';

export const ProposalDueDiligenceTab = ({
  localBoardApproval,
  setLocalBoardApproval,
  localDueDiligence,
  setLocalDueDiligence,
  localMouExecution,
  setLocalMouExecution,
  adminNote,
  setAdminNote
}) => {
  return (
    <div className="space-y-4 text-xs select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-2xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            Board Approval Committee Decision
          </label>
          <select
            value={localBoardApproval}
            onChange={(e) => setLocalBoardApproval(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          >
            <option value="Approved (A-Grade)">Approved (A-Grade)</option>
            <option value="Sanctioned Board">Sanctioned Board</option>
            <option value="Under Technical Review">Under Technical Review</option>
            <option value="Revision Requested by Government">Revision Requested by Government</option>
            <option value="Rejected (Technical Review Failed)">Rejected (Technical Review Failed)</option>
          </select>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-2xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            Statutory Due Diligence Status
          </label>
          <select
            value={localDueDiligence}
            onChange={(e) => setLocalDueDiligence(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          >
            <option value="Passed (All Checks)">Passed (All Checks)</option>
            <option value="Passed (Technical Review)">Passed (Technical Review)</option>
            <option value="Under Technical Review">Under Technical Review</option>
            <option value="Needs Clarification / Revision">Needs Clarification / Revision</option>
            <option value="Failed / Disqualified">Failed / Disqualified</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-2xs">
        <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
          MoU Legal Execution Stage
        </label>
        <select
          value={localMouExecution}
          onChange={(e) => setLocalMouExecution(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
        >
          <option value="Signed & Active">Signed & Active</option>
          <option value="Executed">Executed</option>
          <option value="Drafting Stage">Drafting Stage</option>
          <option value="Sent to University Registrar">Sent to University Registrar</option>
          <option value="Terminated / Not Executed">Terminated / Not Executed</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-2 shadow-2xs">
        <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
          Official Audit Remarks & Clarification Directives
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Cleared by State Technical Committee for ₹75,000 grant sanction, or notes requesting revision."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
        />
      </div>
    </div>
  );
};

export default ProposalDueDiligenceTab;
