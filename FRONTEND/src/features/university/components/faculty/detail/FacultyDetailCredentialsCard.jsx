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
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
              onClick={() => handleCopy(faculty.email, 'email')}
              className="text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="font-mono font-bold text-slate-900 text-xs block">{faculty.email}</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[10.5px] uppercase">Initial / Reset Password</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(faculty.password || 'Faculty@123456', 'pass')}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-900 text-xs block">
            {showPassword ? faculty.password || 'Faculty@123456' : '••••••••••••'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailCredentialsCard;
