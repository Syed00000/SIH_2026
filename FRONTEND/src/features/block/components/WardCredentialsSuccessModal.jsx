import React, { useState } from 'react';
import { X, Check, Copy, KeyRound, ShieldCheck, Landmark } from 'lucide-react';

export const WardCredentialsSuccessModal = ({ isOpen, onClose, wardData }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !wardData) return null;

  const creds = wardData.credentials || {};
  const wardId = wardData.wardId || wardData.deptId || wardData.code || '';
  const loginEmail = creds.loginEmail || wardData.councillorEmail || (wardId ? `${wardId.toLowerCase()}@jharkhand.gov.in` : '');
  const password = creds.password || '••••••••';

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAllCredentials = async () => {
    const fullText = `Municipal Ward Portal Credentials\nWard Name: ${wardData.name}\nWard ID: ${wardId}\nLogin Email: ${loginEmail}\nPassword: ${password}\nPortal URL: ${window.location.origin}/ward`;
    copyToClipboard(fullText, 'all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Ward Created Successfully</h2>
              <p className="text-[11px] text-emerald-700 mt-0.5">Portal access credentials generated</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 truncate">{wardData.name}</h3>
              <p className="text-[11px] text-slate-500">Ward #{wardData.wardNumber} • {wardData.district || 'Ranchi'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Ward In-Charge Login Credentials
            </label>

            {/* Ward ID */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Ward ID</span>
                <span className="text-xs font-mono font-black text-slate-800">{wardId}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(wardId, 'wardId')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer"
                title="Copy Ward ID"
              >
                {copiedField === 'wardId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Login Email */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Login Email</span>
                <span className="text-xs font-mono font-black text-slate-800 break-all">{loginEmail}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(loginEmail, 'email')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer"
                title="Copy Login Email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Initial Password</span>
                <span className="text-xs font-mono font-black text-emerald-700">{password}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(password, 'password')}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg cursor-pointer"
                title="Copy Password"
              >
                {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <span className="font-bold block">Important Notice:</span>
            <span>Please securely copy and deliver these credentials to the Ward Councillor or In-Charge to access the Ward Portal.</span>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={copyAllCredentials}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'all' ? 'All Copied!' : 'Copy All Credentials'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardCredentialsSuccessModal;
