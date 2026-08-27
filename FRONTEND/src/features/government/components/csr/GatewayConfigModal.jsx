import React, { useState } from 'react';
import { X, Activity, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { MOCK_DISBURSAL_MODES } from '../../data/mockCsrLifecycleData.js';

export const GatewayConfigModal = ({ isOpen, onClose, initialMode = null }) => {
  const [selectedChannel, setSelectedChannel] = useState(
    initialMode ? initialMode.channel : MOCK_DISBURSAL_MODES[0].channel
  );
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  if (!isOpen) return null;

  const currentMode = MOCK_DISBURSAL_MODES.find((m) => m.channel === selectedChannel) || MOCK_DISBURSAL_MODES[0];

  const handleTestPing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult({
        status: 'ONLINE & HEALTHY',
        latency: selectedChannel === 'RTGS API' ? '22 ms' : selectedChannel === 'NEFT Batch' ? '38 ms' : '14 ms',
        gatewayAck: 'HTTP 200 OK — Handshake Authenticated (AES-256 GCM)',
        timestamp: new Date().toLocaleTimeString()
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Banking Gateway Telemetry & Diagnostics</h3>
              <p className="text-[11px] text-slate-500 font-medium">Real-Time RBI / Host-to-Host / PFMS API Health</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Channel Selector */}
          <div className="flex items-center space-x-2">
            {MOCK_DISBURSAL_MODES.map((m) => (
              <button
                key={m.channel}
                onClick={() => {
                  setSelectedChannel(m.channel);
                  setPingResult(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedChannel === m.channel
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.channel}
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            <div className="p-3 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Gateway Telemetry Specifications</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Uptime: {currentMode.uptime}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Gateway Protocol</span>
              <span className="font-semibold text-slate-900">{currentMode.gatewayName}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Standard Response Latency</span>
              <span className="font-mono font-bold text-blue-600">{currentMode.latency}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Active Limit / Throughput</span>
              <span className="font-mono font-bold text-slate-900">{currentMode.activeLimit}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Auto-Reconciliation Engine</span>
              <span className="font-medium text-slate-700">{currentMode.autoRecon}</span>
            </div>
          </div>

          {/* Test Ping Action */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Live API Ping Test</span>
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Testing Handshake...' : 'Send Test Ping'}</span>
              </button>
            </div>

            {pingResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900 animate-in fade-in duration-200">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{pingResult.status}</span>
                  </span>
                  <span className="font-mono text-[10.5px]">Latency: {pingResult.latency}</span>
                </div>
                <p className="text-[10.5px] font-mono text-emerald-800">{pingResult.gatewayAck}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayConfigModal;
