import React, { useState } from 'react';
import { KeyRound, ShieldCheck, BellRing } from 'lucide-react';

export const UniversitySettingsPanel = () => {
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-3.5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          University Portal Settings & Security
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage HEI access credentials, nodal officer delegation, and notification preferences.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-none p-4 space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-slate-700" />
          <span>Security & HEI Nodal Credentials</span>
        </h2>

        {saved && (
          <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Credentials updated successfully! Synchronized with database.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block font-bold text-slate-900 mb-1">Current Password</label>
            <input
              type="password"
              value={currPwd}
              onChange={(e) => setCurrPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-slate-900"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-900 mb-1">New Password</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-none text-xs font-bold hover:bg-black cursor-pointer"
          >
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default UniversitySettingsPanel;
