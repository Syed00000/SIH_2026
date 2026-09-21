import React from 'react';
import { KeyRound, Mail, Eye, EyeOff, Copy, Check, AlertCircle } from 'lucide-react';
import { MASKED_CREDENTIAL } from './departmentDistricts.helper.js';

export const DepartmentDistrictCredentialsCard = ({
  loginEmail,
  districtSecret,
  isPasswordVisible,
  togglePasswordVisibility,
  targetId,
  handleCopy,
  copiedKey
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Portal Access Credentials</h2>
            <p className="text-[10.5px] text-slate-400">Department login ID & authentication key</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          RBAC Security
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Login ID */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Mail className="w-3 h-3" /> Portal Login ID / Email
            </span>
            <button
              type="button"
              onClick={() => handleCopy(loginEmail, 'loginId')}
              className="flex items-center gap-1 text-[10.5px] font-bold text-[#0f4b3a] hover:underline cursor-pointer"
            >
              {copiedKey === 'loginId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'loginId' ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
          <div className="font-mono font-bold text-slate-900 text-xs break-all bg-white px-3 py-2 rounded-lg border border-slate-200/80">
            {loginEmail}
          </div>
        </div>

        {/* Password */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Access Password
            </span>
            <div className="flex items-center gap-2">
              {districtSecret !== '-' && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(null, `detail-${targetId}`)}
                  className="flex items-center gap-1 text-[10.5px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isPasswordVisible ? 'Hide' : 'Show'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCopy(districtSecret, 'auth-key')}
                className="flex items-center gap-1 text-[10.5px] font-bold text-[#0f4b3a] hover:underline cursor-pointer"
              >
                {copiedKey === 'auth-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'auth-key' ? 'Copied' : 'Copy Password'}</span>
              </button>
            </div>
          </div>
          <div className="font-mono font-bold text-slate-900 text-xs bg-white px-3 py-2 rounded-lg border border-slate-200/80 flex items-center justify-between">
            <span>{districtSecret === '-' ? 'Not Configured' : isPasswordVisible ? districtSecret : MASKED_CREDENTIAL}</span>
          </div>
        </div>

        <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Share these credentials strictly with authorized nodal officers of this department for grievance resolution & technician dispatch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDistrictCredentialsCard;
