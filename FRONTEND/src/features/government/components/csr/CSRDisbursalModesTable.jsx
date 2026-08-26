import React from 'react';
import { Check } from 'lucide-react';
import { MOCK_DISBURSAL_MODES } from '../../data/mockCsrLifecycleData.js';

export const CSRDisbursalModesTable = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
          PHASE 8: APPROVED PAYMENT DISBURSAL MODES
        </h3>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
          Secure, trackable gateway channels deployed for fund distribution.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Mode Channel</th>
              <th className="py-3.5 px-4">Primary Use Case</th>
              <th className="py-3.5 px-4">Processing Rules & Limits</th>
              <th className="py-3.5 px-5">Audit Traceability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {MOCK_DISBURSAL_MODES.map((row) => (
              <tr key={row.channel} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${row.channelStyle}`}>
                    {row.channel}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 text-[11px]">
                  {row.useCase}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium text-[11px]">
                  {row.rules}
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{row.audit}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSRDisbursalModesTable;
