import React from 'react';
import { Briefcase, Mail, Phone, Copy, Check } from 'lucide-react';

export const DepartmentDistrictContactsCard = ({
  dist,
  loginEmail,
  handleCopy,
  copiedKey
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Official In-Charge & Contacts</h2>
          <p className="text-[10.5px] text-slate-400">Direct contact details for administrative coordination</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Officer Name</span>
            <p className="font-extrabold text-slate-900">{dist.headName || 'Officer in Charge'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Designation</span>
            <p className="font-bold text-slate-800">{dist.headRole || 'Department Head'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                <Mail className="w-3 h-3" /> Official Email
              </span>
              <p className="font-mono text-slate-800 truncate">{dist.headEmail || loginEmail}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(dist.headEmail || loginEmail, 'headEmail')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="Copy Email"
            >
              {copiedKey === 'headEmail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-0.5">
                <Phone className="w-3 h-3" /> Helpline / Phone
              </span>
              <p className="font-mono text-slate-800 truncate">{dist.headPhone || '0651-2450000'}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(dist.headPhone || '0651-2450000', 'headPhone')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="Copy Phone"
            >
              {copiedKey === 'headPhone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDistrictContactsCard;
