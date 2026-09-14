import React from 'react';
import { Lock, Eye, EyeOff, Copy, Check, ShieldCheck } from 'lucide-react';

export const FacultyDetailCredentialsCard = ({
  faculty,
  showPassword,
  setShowPassword,
  copiedField,
  setCopiedField
}) => {
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const passwordVal = faculty?.password || faculty?.generatedPassword || faculty?.credentials?.password || 'amir@1234';

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3 text-left">
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
        <Lock className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-extrabold text-slate-900">Faculty Portal Access Credentials</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[10.5px] uppercase">Login Email ID</span>
            <button
              type="button"
              onClick={() => handleCopy(faculty?.email, 'email')}
              className="text-slate-400 hover:text-slate-900 cursor-pointer p-0.5"
              title="Copy Email ID"
            >
              {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{faculty?.email || 'N/A'}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[10.5px] uppercase">Login Password</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(passwordVal, 'password')}
                className="text-slate-400 hover:text-slate-900 cursor-pointer p-0.5"
                title="Copy Password"
              >
                {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900 text-xs block">
              {showPassword ? passwordVal : '••••••••••••'}
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailCredentialsCard;
