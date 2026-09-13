import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Mail, Phone, KeyRound, Copy, Check, Eye, EyeOff, MapPin, Briefcase } from 'lucide-react';

export const ViewBlockDepartmentModal = ({ department, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!isOpen || !department) return null;

  const loginId = department.credentials?.loginId || department.credentials?.loginEmail || department.headEmail || 'dept@jharkhand.gov.in';
  const password = department.credentials?.password || department.credentials?.generatedPassword || 'Dept@JH2026!';

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Department: ${department.name}\nCode: ${department.code || department.deptId}\nLogin ID: ${loginId}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{department.name}</h3>
              <p className="text-[10.5px] font-mono text-slate-500">{department.deptId || department.code} • {department.category || 'Block Office'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Officer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                <Briefcase className="w-3 h-3" /> In-Charge Officer
              </span>
              <p className="font-extrabold text-slate-900">{department.headName || 'Officer in Charge'}</p>
              <p className="text-[11px] text-slate-500">{department.headRole || 'Department Head'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                <Phone className="w-3 h-3" /> Office Contact
              </span>
              <p className="font-extrabold text-slate-900">{department.headPhone || '0651-2450000'}</p>
              <p className="text-[11px] text-slate-500">{department.district || 'Ranchi'} • {department.block || 'Block'}</p>
            </div>
          </div>

          {/* Description / Mandate */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Department Mandate & Scope</span>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              {department.description || `Local departmental administration responsible for citizen service delivery and problem resolution across ${department.block || 'Block'}.`}
            </p>
          </div>

          {/* Credentials Card */}
          <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#007A61] font-bold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Portal Access Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex items-center gap-1 text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Credentials Copied' : 'Copy Credentials'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <span className="text-[9.5px] font-sans text-slate-400 block font-bold uppercase mb-0.5">Login Email / ID</span>
                <span className="text-slate-800 font-bold truncate block">{loginId}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9.5px] font-sans text-slate-400 font-bold uppercase">Password</span>
                  {password !== '-' && (
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="text-slate-400 hover:text-slate-600 font-sans"
                    >
                      {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <span className="text-slate-800 font-bold tracking-wider block">
                  {isPasswordVisible ? password : '••••••••••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium">Block Department Record</span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlockDepartmentModal;

