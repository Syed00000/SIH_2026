import React, { useState } from 'react';
import { KeyRound, RefreshCw, Eye, EyeOff, Copy, Check, Mail } from 'lucide-react';

export const ApproveIndustryCredentialsForm = ({
  loginEmail,
  onLoginEmailChange,
  password,
  onPasswordChange,
  onRegeneratePassword,
  officialEmail
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50/70 p-4 rounded-md border border-slate-200/80 space-y-3 select-none">
      <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5 pb-1 border-b border-slate-200/60">
        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
        <span>Assign Portal Login Credentials</span>
      </h4>

      {/* Login Email */}
      <div>
        <label className="text-slate-700 font-semibold text-xs block mb-1">
          Portal Login Email / Username <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => onLoginEmailChange(e.target.value)}
          className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Password Generator */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-slate-700 font-semibold text-xs">
            Temporary Password <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={onRegeneratePassword}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Generate New Password</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full h-8 px-2.5 text-xs font-mono font-bold pr-9 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyPassword}
            className="h-8 px-2.5 border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded-md shrink-0 text-xs font-medium cursor-pointer shadow-2xs"
            title="Copy Password"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-md text-[11px] text-blue-900 flex items-start space-x-2">
        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          Upon approving, an official confirmation will be sent to <strong>{officialEmail}</strong>.
        </p>
      </div>
    </div>
  );
};

export default ApproveIndustryCredentialsForm;
