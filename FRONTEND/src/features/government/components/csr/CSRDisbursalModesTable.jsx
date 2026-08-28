import React, { useState } from 'react';
import { Check, Zap, Activity } from 'lucide-react';
import { GatewayConfigModal } from './GatewayConfigModal.jsx';

const DISBURSAL_GATEWAYS = [
  { channel: 'PFMS Direct Node', channelStyle: 'bg-blue-50 text-blue-800 border-blue-200', useCase: 'Direct University Node Grant Release', rules: 'Maker-Checker Approval Required', audit: '100% PFMS Audit Trail' },
  { channel: 'RBI RTGS Bulk Node', channelStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200', useCase: 'State Treasury Direct Account Credit', rules: 'Daily Limit: ₹5.00 Cr', audit: 'RBI UTR Number Verified' },
  { channel: 'Corporate Escrow Sweep', channelStyle: 'bg-purple-50 text-purple-800 border-purple-200', useCase: 'Automated CSR Tranche Disbursal', rules: 'Triggered upon 100% milestone clearance', audit: 'Tripartite MoU Compliant' }
];

export const CSRDisbursalModesTable = () => {
  const [selectedGatewayMode, setSelectedGatewayMode] = useState(null);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              PHASE 8: APPROVED PAYMENT DISBURSAL MODES
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Secure, trackable gateway channels deployed for fund distribution. Click any channel to test API health.
            </p>
          </div>

          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>All Gateways Operational</span>
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Mode Channel</th>
                <th className="py-3.5 px-4">Primary Use Case</th>
                <th className="py-3.5 px-4">Processing Rules & Limits</th>
                <th className="py-3.5 px-4">Audit Traceability</th>
                <th className="py-3.5 px-5 text-right">API Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {DISBURSAL_GATEWAYS.map((row) => (
                <tr
                  key={row.channel}
                  onClick={() => setSelectedGatewayMode(row)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${row.channelStyle}`}>
                      {row.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 text-[11px]">{row.useCase}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium text-[11px]">{row.rules}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{row.audit}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGatewayMode(row);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 group-hover:border-blue-300 group-hover:text-blue-600 text-[11px] font-bold cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span>Test Ping</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <GatewayConfigModal
        isOpen={Boolean(selectedGatewayMode)}
        onClose={() => setSelectedGatewayMode(null)}
        initialMode={selectedGatewayMode}
      />
    </>
  );
};

export default CSRDisbursalModesTable;
