import React from 'react';
import { Building2, CheckCircle2, Coins, GraduationCap } from 'lucide-react';
import { formatAmountINR } from './funding.helpers.js';

export const IndustryRequestsTab = ({ incomingRequests = [], onApproveAndDisburse }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">University Funding Proposals</h3>
          <p className="text-xs text-slate-500">Review requests submitted by HEIs. Approving will automatically deduct the grant from your selected fund pool.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Total: {incomingRequests.length}</span>
        </div>
      </div>

      {incomingRequests && incomingRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[9px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Req ID</th>
                <th className="px-4 py-3">Project / Innovation Title</th>
                <th className="px-4 py-3">Beneficiary University</th>
                <th className="px-4 py-3">Requested Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomingRequests.map((req) => {
                const isApproved = req.status === 'Approved' || req.status === 'Funded';
                const reqAmt = req.amountNumber || Number(String(req.estimatedBudget || '0').replace(/[^\d]/g, '')) || 0;

                return (
                  <tr key={req.requestId || req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-500 font-bold">{req.requestId || 'REQ-01'}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-extrabold text-slate-900 block">{req.projectTitle}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Faculty PI: {req.facultyName || 'Nodal SPOC'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {req.universityName || req.universityCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-black text-slate-900 text-sm">
                        {reqAmt > 0 ? formatAmountINR(reqAmt) : 'As per Proposal'}
                      </span>
                      <span className="block text-[9px] text-slate-400 font-medium">{req.duration || '3-6 Months'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[9px] uppercase tracking-wider ${
                        isApproved ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isApproved ? 'Funded & Approved' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {isApproved ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Disbursed
                        </span>
                      ) : (
                        <button
                          onClick={() => onApproveAndDisburse(req)}
                          className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 ml-auto cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Approve & Disburse</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
          <p className="font-bold text-slate-600">No Incoming University Funding Proposals</p>
          <p className="text-[11px] text-slate-400 mt-1">When universities submit R&D collaboration or grant requests, they will appear here for review.</p>
        </div>
      )}
    </div>
  );
};

export default IndustryRequestsTab;
