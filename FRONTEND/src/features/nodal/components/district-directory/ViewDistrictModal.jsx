import React from 'react';
import { X, Briefcase, Mail, Phone, MapPin, Key } from 'lucide-react';

export const ViewDistrictModal = ({ isOpen, department, onClose }) => {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">{department.name}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{department.deptId || department.code} • District Authority</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">District</span>
              <p className="font-extrabold text-slate-800">{department.district} District</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
              <p className="font-extrabold text-emerald-600">{department.status || 'Active'}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Head / Officer In-Charge</span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p className="font-extrabold text-slate-800">{department.headName || 'Department Head'}</p>
              {department.headRole && (
                <p className="text-[11px] text-slate-500">{department.headRole}</p>
              )}
              {department.headEmail && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {department.headEmail}
                </p>
              )}
              {department.headPhone && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {department.headPhone}
                </p>
              )}
            </div>
          </div>

          {department.description && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mandate & Scope</span>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-[11px]">
                {department.description}
              </p>
            </div>
          )}

          {department.credentials && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Department Credentials</span>
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-1">
                <p className="flex items-center gap-1 text-slate-700">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold">Login Email:</span> {department.credentials?.loginEmail || department.headEmail}
                </p>
                <p className="text-slate-600">
                  <span className="font-bold">Password:</span> {department.credentials?.password || '••••••••'}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDistrictModal;
