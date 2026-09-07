import React from 'react';

export const IndustryGrantTechCredentialsSection = ({
  credentials,
  setCredentials,
  validity,
  setValidity,
  notes,
  setNotes
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10.5px] font-black uppercase text-slate-700 block mb-1">
            Generated License / Access Key
          </label>
          <input
            type="text"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
          />
        </div>
        <div>
          <label className="text-[10.5px] font-black uppercase text-slate-700 block mb-1">
            License Validity Period
          </label>
          <select
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
          >
            <option value="6 Months Active R&D">6 Months Active R&D</option>
            <option value="1 Year Active R&D">1 Year Active R&D</option>
            <option value="Permanent HEI Campus Grant">Permanent HEI Campus Grant</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10.5px] font-black uppercase text-slate-700 block">
            Deployment Notes & Technical Scope (Auto-filled from Prototype)
          </label>
          <span className="text-[10px] text-[#007A61] font-bold">Synced with Student Prototype Specs</span>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Granted for thermal CFD modeling and telemetry simulation..."
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-[#007A61]"
        />
      </div>
    </div>
  );
};

export default IndustryGrantTechCredentialsSection;
