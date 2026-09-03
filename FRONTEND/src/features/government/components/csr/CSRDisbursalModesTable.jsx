import React, { useState, useEffect } from 'react';
import { Check, Activity, Loader2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';
import { GatewayConfigModal } from './GatewayConfigModal.jsx';

export const CSRDisbursalModesTable = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGatewayMode, setSelectedGatewayMode] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGateways = async () => {
      try {
        const res = await apiClient.get('government/funds/gateways');
        const data = res?.data?.data || res?.data || [];
        if (isMounted) {
          setGateways(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('Failed to load gateways from backend:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGateways();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              Approved Payment Disbursal Modes
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Secure, trackable gateway channels deployed for fund distribution. Click any channel to test API health.
            </p>
          </div>

          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-900 self-start sm:self-auto">
            <Activity className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Gateways Operational ({gateways.length} Live)</span>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Channel Mode</th>
                <th className="py-3 px-4">Primary Use Case</th>
                <th className="py-3 px-4">Processing Rules & Limits</th>
                <th className="py-3 px-4">Audit Traceability</th>
                <th className="py-3 px-4 text-right">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-500" />
                    <span>Loading verified state payment gateways from database...</span>
                  </td>
                </tr>
              ) : gateways.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No active gateway channels configured.
                  </td>
                </tr>
              ) : (
                gateways.map((row) => (
                  <tr
                    key={row.gatewayId || row.id || row._id}
                    onClick={() => setSelectedGatewayMode(row)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 text-[11.5px]">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 text-[11px]">
                      {row.primaryUse}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-normal text-[11px]">
                      {row.dailyLimit}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1.5 font-medium text-slate-900 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-[#007A61]" />
                        <span>{row.protocol}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGatewayMode(row);
                        }}
                        className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Test Ping
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GatewayConfigModal
        isOpen={Boolean(selectedGatewayMode)}
        onClose={() => setSelectedGatewayMode(null)}
        initialMode={selectedGatewayMode}
        gateways={gateways}
      />
    </>
  );
};

export default CSRDisbursalModesTable;
