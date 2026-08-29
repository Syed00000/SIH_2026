import React, { useState } from 'react';
import { X, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Banking Gateway Telemetry & Diagnostics</h3>
              <p className="text-xs text-slate-500 font-normal">Real-Time RBI / Host-to-Host / PFMS API Health</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-white">
          {/* Channel Selector */}
          <div className="flex items-center space-x-2">
            {MOCK_DISBURSAL_MODES.map((m) => (
              <button
                key={m.channel}
                onClick={() => {
                  setSelectedChannel(m.channel);
                  setPingResult(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                  selectedChannel === m.channel
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.channel}
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
            <div className="p-3 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Gateway Telemetry</span>
              <span className="text-[11px] font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                Uptime: {currentMode.uptime}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Gateway Protocol</span>
              <span className="font-semibold text-slate-900">{currentMode.gatewayName}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Response Latency</span>
              <span className="font-mono font-bold text-slate-900">{currentMode.latency}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Active Limit / Throughput</span>
              <span className="font-mono font-bold text-slate-900">{currentMode.activeLimit}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Auto-Reconciliation Engine</span>
              <span className="font-normal text-slate-700">{currentMode.autoRecon}</span>
            </div>
          </div>

          {/* Test Ping Action */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Live API Ping Test</span>
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-white ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Testing Handshake...' : 'Send Test Ping'}</span>
              </button>
            </div>

            {pingResult && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-slate-900 animate-fadeIn">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                    <span>{pingResult.status}</span>
                  </span>
                  <span className="font-mono text-[11px]">Latency: {pingResult.latency}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-700">{pingResult.gatewayAck}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayConfigModal;
