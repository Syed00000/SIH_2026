import React from 'react';
import { X, Building2, Mail, Phone, MapPin, Users, Key } from 'lucide-react';

export const ViewBlockModal = ({ isOpen, block, onClose }) => {
  if (!isOpen || !block) return null;

  const panchayats = block.panchayats || [];
  const departments = block.departments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">{block.name}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{block.blockId} • Local Body</p>
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
              <p className="font-extrabold text-slate-800">{block.district} District</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
              <p className="font-extrabold text-emerald-600">{block.status || 'Active'}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Block Development Officer (BDO)</span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p className="font-extrabold text-slate-800">{block.bdoName || 'BDO Officer'}</p>
              {block.bdoEmail && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {block.bdoEmail}
                </p>
              )}
              {block.bdoPhone && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {block.bdoPhone}
                </p>
              )}
            </div>
          </div>

          {block.credentials && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Block Portal Credentials</span>
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-1">
                <p className="flex items-center gap-1 text-slate-700">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-bold">Login Email:</span> {block.credentials?.loginEmail || block.bdoEmail}
                </p>
                <p className="text-slate-600">
                  <span className="font-bold">Password:</span> {block.credentials?.password || '••••••••'}
                </p>
              </div>
            </div>
          )}

          {panchayats.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Gram Panchayats ({panchayats.length})</span>
              <div className="flex flex-wrap gap-1">
                {panchayats.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {p}
                  </span>
                ))}
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

export default ViewBlockModal;
