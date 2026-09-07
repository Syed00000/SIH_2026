import React, { useState } from 'react';
import { Building2, User, Mail, Phone, MapPin, KeyRound, Copy, Check, ShieldCheck } from 'lucide-react';

export const DepartmentProfilePanel = ({ department }) => {
  const [copied, setCopied] = useState(false);
  if (!department) return null;

  const creds = department.credentials || {};
  const digits = (department.deptId || '').replace(/\D/g, '') || '2026';
  const pass = creds.password || creds.generatedPassword || `Dept@JH${digits}!`;
  const loginEmail = creds.loginEmail || department.headEmail || `${(department.deptId || 'dept').toLowerCase()}@jharkhand.gov.in`;

  const copyCreds = () => {
    navigator.clipboard.writeText(`Login Email: ${loginEmail}\nPassword: ${pass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Overview Identity */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-black text-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">{department.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{department.deptId}</span>
              <span>•</span>
              <span>{department.category || 'District Department'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Head / Mukhiya Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-[#007A61]" />
            <span>Responsible Head / Mukhiya</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-bold">Officer Name:</span>
              <span className="font-extrabold text-slate-800">{department.headName || 'Not Assigned'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-bold">Designation:</span>
              <span className="font-semibold text-slate-700">{department.headRole || 'Department Head'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-bold">Official Email:</span>
              <span className="font-mono text-slate-700">{department.headEmail || 'Pending'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-bold">Official Contact:</span>
              <span className="font-mono text-slate-700">{department.headPhone || '9876543210'}</span>
            </div>
          </div>
        </div>

        {/* Location & Jurisdiction */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Administrative Jurisdiction</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-bold">District:</span>
              <span className="font-bold text-slate-800">{department.district || 'Ranchi'}</span>
            </div>
            {department.block && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-bold">Block / Tehsil:</span>
                <span className="font-semibold text-slate-700">{department.block}</span>
              </div>
            )}
            {department.panchayat && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-bold">Panchayat:</span>
                <span className="font-semibold text-slate-700">{department.panchayat}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-bold">State:</span>
              <span className="font-bold text-slate-800">Jharkhand</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Login Credentials Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Official Portal Credentials</h3>
          </div>
          <button
            type="button"
            onClick={copyCreds}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Login ID / Official Email</span>
            <div className="font-mono font-bold text-slate-800 mt-0.5">{loginEmail}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Current Password</span>
            <div className="font-mono font-bold text-slate-800 mt-0.5">{pass}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentProfilePanel;
