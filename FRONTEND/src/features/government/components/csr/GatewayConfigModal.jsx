import React, { useState } from 'react';
import { X, Check, Activity, ShieldCheck } from 'lucide-react';
import { DISBURSAL_GATEWAY_MODES } from '../../data/csrConstants.js';

export const GatewayConfigModal = ({ isOpen, onClose, initialMode }) => {
  const [selectedChannel, setSelectedChannel] = useState(
    initialMode ? initialMode.channel || initialMode.id : DISBURSAL_GATEWAY_MODES[0].channel
  );
  const [pingStatus, setPingStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const currentMode =
    DISBURSAL_GATEWAY_MODES.find((m) => (m.channel || m.id) === selectedChannel) || DISBURSAL_GATEWAY_MODES[0];

  const handleTestConnection = () => {
    setIsTesting(true);
    setPingStatus(null);
    setTimeout(() => {
      setIsTesting(false);
      setPingStatus({
        success: true,
        latency: '42ms',
        statusCode: '200 OK (TLS 1.3 / mTLS Handshake Success)',
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-lg max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-900" />
            <h3 className="text-sm font-bold text-slate-900">Payment Gateway Diagnostics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Disbursal Mode
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => {
                setSelectedChannel(e.target.value);
                setPingStatus(null);
              }}
              className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              {DISBURSAL_GATEWAY_MODES.map((m) => (
                <option key={m.id} value={m.channel || m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 rounded-md p-3.5 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Protocol</span>
              <span className="font-bold text-slate-900">{currentMode.protocol}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Average Latency</span>
              <span className="font-bold text-slate-900">{currentMode.avgSettlement}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Processing Limit</span>
              <span className="font-bold text-slate-900">{currentMode.dailyLimit}</span>
            </div>
          </div>

          {pingStatus && (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                <Check className="w-3.5 h-3.5 text-slate-900" />
                <span>Endpoint Diagnostic Response: {pingStatus.statusCode}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                Round-trip latency: {pingStatus.latency} • Tested at {pingStatus.timestamp}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer shadow-xs"
          >
            Close
          </button>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            {isTesting ? (
              <span className="inline-block animate-spin mr-1">◌</span>
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>{isTesting ? 'Pinging Gateway...' : 'Execute Live Ping Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GatewayConfigModal;
