import React, { useState } from 'react';
import { X, Landmark, Mail, Phone, MapPin, Key, Copy, Check, ShieldCheck } from 'lucide-react';

export const ViewWardModal = ({ isOpen, ward, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !ward) return null;

  const wardCode = String(ward.wardNumber || ward.code || '').replace(/\D/g, '') || '21';
  const code = wardCode.padStart(2, '0');
  const loginEmail = ward.credentials?.loginEmail || ward.credentials?.loginId || ward.headEmail || ward.councillorEmail || `ward${code}.ranchi@jharkhand.gov.in`;
  const password = ward.credentials?.password || ward.credentials?.generatedPassword || `Ward@${code}2026`;

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAllCredentials = () => {
    const full = `Municipal Ward Portal Credentials\nWard: ${ward.name}\nWard ID: ${ward.deptId || ward.code || ward.wardId || `WRD-JH-RN-${code}`}\nLogin Email: ${loginEmail}\nPassword: ${password}\nURL: ${window.location.origin}/ward`;
    copyToClipboard(full, 'all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">{ward.name}</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {ward.deptId || ward.code || ward.wardId} • Ward #{ward.wardNumber || ward.district || '133'}
              </p>
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
              <p className="font-extrabold text-slate-800">{ward.district || 'Jharkhand'} District</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
              <p className="font-extrabold text-emerald-600">{ward.status || 'Active'}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Councillor / In-charge</span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p className="font-extrabold text-slate-800">
                {ward.headName || ward.councillorName || 'Not Assigned'} {ward.headRole ? `(${ward.headRole})` : ''}
              </p>
              {(ward.headEmail || ward.councillorEmail) && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {ward.headEmail || ward.councillorEmail}
                </p>
              )}
              {(ward.headPhone || ward.councillorPhone) && (
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {ward.headPhone || ward.councillorPhone}
                </p>
              )}
            </div>
          </div>

          {/* Secure Credentials */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ward Portal Credentials</span>
            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
                  <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-bold shrink-0">Login Email:</span>
                  <span className="font-mono font-semibold text-slate-900 select-all truncate">{loginEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(loginEmail, 'email')}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-900 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-amber-200/60">
                <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
                  <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-bold shrink-0">Password:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200 select-all">
                    {password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-900 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === 'password' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {ward.localities && ward.localities.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Localities / Mohallas ({ward.localities.length})</span>
              <div className="flex flex-wrap gap-1">
                {ward.localities.map((loc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {loc}
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

export default ViewWardModal;
