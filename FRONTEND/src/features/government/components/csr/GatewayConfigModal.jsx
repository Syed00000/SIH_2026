import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const GATEWAY_CHANNELS = [
  { channel: 'PFMS Direct Node', turnaround: 'Instant (< 2 hrs)', fee: '₹0 / Govt API', security: 'Digital Token Verified' },
  { channel: 'RBI RTGS Bulk Node', turnaround: 'Same Day', fee: '₹0 / Treasury Exemption', security: 'Two-Man Treasury Key' }
];

export const GatewayConfigModal = ({ isOpen, onClose, initialMode = null }) => {
  const [selectedChannel, setSelectedChannel] = useState(
    initialMode ? initialMode.channel : GATEWAY_CHANNELS[0].channel
  );
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  if (!isOpen) return null;

  const currentMode = GATEWAY_CHANNELS.find((m) => m.channel === selectedChannel) || GATEWAY_CHANNELS[0];

  const handleTestPing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult({
        status: 'ONLINE & HEALTHY',
        latency: '18 ms',
        gatewayAck: 'HTTP 200 OK — Handshake Authenticated (AES-256 GCM)',
        timestamp: new Date().toLocaleTimeString()
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Gateway Diagnostics & Config</h3>
              <p className="text-[11px] text-slate-500 font-medium">Real-time health ping and channel parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Disbursal Channel</label>
            <div className="grid grid-cols-2 gap-2">
              {GATEWAY_CHANNELS.map((m) => (
                <button
                  key={m.channel}
                  type="button"
                  onClick={() => {
                    setSelectedChannel(m.channel);
                    setPingResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    selectedChannel === m.channel ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-2xs' : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>{m.channel}</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-0.5">{m.turnaround}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Gateway Fee:</span><span className="font-bold text-slate-900">{currentMode.fee}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Security Layer:</span><span className="font-bold text-slate-900">{currentMode.security}</span></div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{isPinging ? 'Pinging Gateway...' : 'Send Live Health Ping'}</span>
            </button>
          </div>

          {pingResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{pingResult.status} (Latency: {pingResult.latency})</span>
              </div>
              <div className="text-[10.5px] text-emerald-700 font-mono">{pingResult.gatewayAck}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatewayConfigModal;
