import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Copy, Check } from 'lucide-react';

export const ViewBudgetOfficerModal = ({ officer, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !officer) return null;

  const loginId = officer.credentials?.loginId || officer.credentials?.loginEmail || officer.email;
  const password = officer.credentials?.password || officer.credentials?.generatedPassword || 'Officer@JH2026!';

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Officer ID: ${officer.officerId}\nLogin ID: ${loginId}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">{officer.name || officer.fullName}</h3>
              <p className="text-[10px] font-mono text-slate-500">{officer.officerId} • {officer.designation}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Designation</span>
              <p className="font-extrabold text-slate-900 mt-0.5">{officer.designation}</p>
              <p className="text-[11px] text-slate-500">{officer.departmentName || 'Budget Wing'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Mobile</span>
              <p className="font-extrabold text-slate-900 mt-0.5">{officer.phone || '9431100000'}</p>
              <p className="text-[11px] text-slate-500">{officer.district || 'Ranchi'} • {officer.block || 'Block'}</p>
            </div>
          </div>

          {officer.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Role Description / Scope</span>
              <p className="text-slate-700 leading-relaxed">{officer.notes}</p>
            </div>
          )}

          {/* Credentials Card */}
          <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#007A61] font-bold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Officer Login Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex items-center gap-1 text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-teal-100">
                <span className="text-[9.5px] font-sans text-slate-400 block font-bold uppercase">Login ID</span>
                <span className="text-slate-800 font-bold truncate block">{loginId}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-teal-100">
                <span className="text-[9.5px] font-sans text-slate-400 block font-bold uppercase">Password</span>
                <span className="text-slate-800 font-bold tracking-wider">{password}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBudgetOfficerModal;
