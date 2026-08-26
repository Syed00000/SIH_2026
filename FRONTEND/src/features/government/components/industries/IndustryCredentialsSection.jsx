import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Copy, Check } from 'lucide-react';

export const IndustryCredentialsSection = ({
  loginEmail,
  loginPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
        <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="text-[11px] font-bold text-slate-800">Portal Login Credentials</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Login Email */}
        <div>
          <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
            Portal Login ID
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
            <span className="font-mono text-[11px] font-semibold text-slate-800 truncate mr-2 select-all">
              {loginEmail}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(loginEmail, 'email')}
              className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer shrink-0"
              title="Copy Login Email"
            >
              {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
            Access Password
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
            <span className="font-mono text-[11px] font-semibold text-slate-800 tracking-wider truncate mr-2 select-all">
              {showPassword ? loginPassword : '••••••••••••'}
            </span>
            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(loginPassword, 'password')}
                className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer"
                title="Copy Password"
              >
                {copiedField === 'password' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryCredentialsSection;
