import React from 'react';
import { KeyRound, Sparkles } from 'lucide-react';

export const DepartmentCredentialsSection = ({
  formData,
  handleChange,
  handleGeneratePassword
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">5. State Department Principal Login & Access</h3>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Login ID / Official Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="credentials.loginEmail"
            placeholder="dept@jharkhand.gov.in"
            value={formData.credentials.loginEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Username / Department UID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="credentials.loginId"
            placeholder="e.g. RDD-JH-001"
            value={formData.credentials.loginId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Initial Password <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="credentials.password"
            placeholder="Enter or generate password"
            value={formData.credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-mono"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate Secure Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};
