import React from 'react';
import { FileText, Receipt } from 'lucide-react';
import { formatAmountINR } from './funding.helpers.js';

export const IndustryLedgerTab = ({ disbursements = [], totalDisbursed = 0, onViewReceipt }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">Corporate Grants Disbursement Ledger</h3>
          <p className="text-xs text-slate-500">Official audit trail of all payments disbursed to universities with UTRs and escrow verification.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">
            Total Payouts: {formatAmountINR(totalDisbursed)}
          </span>
        </div>
      </div>

      {disbursements && disbursements.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[9px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Disbursement ID</th>
                <th className="px-4 py-3">Beneficiary University</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Debited Fund Pool</th>
                <th className="px-4 py-3">Amount Disbursed</th>
                <th className="px-4 py-3">Settlement & UTR</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disbursements.map((disb) => (
                <tr key={disb.disbursementId || disb._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">{disb.disbursementId}</td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-slate-900 block">{disb.universityName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{disb.universityCode}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{disb.projectTitle}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                      {disb.fundTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-700 text-sm">
                    {formatAmountINR(disb.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-mono text-[10px] text-slate-700 font-bold">{disb.utrNumber}</span>
                    <span className="block text-[9px] text-slate-400">{disb.mode}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                    {new Date(disb.disbursedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onViewReceipt(disb)}
                      className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Sanction Order</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
          <p className="font-bold text-slate-600">No Grant Disbursements Settled Yet</p>
          <p className="text-[11px] text-slate-400 mt-1">Once you disburse funds to a university or project, the official transaction audit records will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default IndustryLedgerTab;
