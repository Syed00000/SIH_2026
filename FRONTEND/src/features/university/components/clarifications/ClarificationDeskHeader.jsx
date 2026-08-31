import React from 'react';

export const ClarificationDeskHeader = ({ universityName, totalCount, activeRoomsCount }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 rounded-2xl text-white shadow-md border border-emerald-800/40 relative overflow-hidden text-left">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-300">
              Live State Intercom Hub
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Nodal Clarification & Socket.IO Desk
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
            Real-time 2-way communication channel between <strong>{universityName}</strong> and the State Nodal Officer desk. Discuss telemetry, GPS boundaries, and lab validations before accepting challenges.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Total Allocations</span>
            <span className="text-lg font-black text-white">{totalCount}</span>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-400/30 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Active Rooms</span>
            <span className="text-lg font-black text-emerald-300">{activeRoomsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClarificationDeskHeader;
