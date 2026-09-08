import React from 'react';
import { X, Building2, MapPin, UserCheck, Phone, Mail, KeyRound, ShieldCheck } from 'lucide-react';

export const ViewBlockModal = ({ isOpen, onClose, block }) => {
  if (!isOpen || !block) return null;

  const loginId = block.credentials?.loginId || block.credentials?.loginEmail || block.bdoEmail || 'bdo.kanke@jharkhand.gov.in';
  const password = block.credentials?.password || 'Block@2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 leading-none">{block.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#007A61]/10 text-[#007A61]">
                  {block.blockId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{block.district} District • Administrative Block Details</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          {/* Officer Details Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BDO Administration</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10.5px] text-slate-400">BDO Name:</span>
                <p className="font-extrabold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{block.bdoName || 'Not Assigned'}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10.5px] text-slate-400">Contact Phone:</span>
                <p className="font-mono text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{block.bdoPhone || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Dedicated Portal Credentials Card */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Portal Login Credentials</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                Active Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10.5px] text-emerald-700">Login ID / Email:</span>
                <p className="font-mono font-bold text-slate-900 truncate" title={loginId}>{loginId}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10.5px] text-emerald-700">Password:</span>
                <p className="font-mono font-bold text-slate-900">{password}</p>
              </div>
            </div>
          </div>

          {/* Gram Panchayats List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                Gram Panchayats ({block.panchayats?.length || 0})
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Governance
              </span>
            </div>
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {(block.panchayats || []).map((p) => (
                <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#007A61]" />
                  <span>{p}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
