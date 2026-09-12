import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Copy, Check, ShieldCheck, Mail, AlertCircle, Lock } from 'lucide-react';

export const DepartmentCredentialsCard = ({ department, onToast }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!department) return null;

  const deptId = department.deptId || department.id || department._id;
  const deptDigits = (deptId || '').replace(/\D/g, '') || '2026';
  const defaultPass = department.credentials?.password || department.credentials?.generatedPassword || `Dept@JH${deptDigits}!`;
  const loginEmail = department.credentials?.loginEmail || department.headEmail || `${(deptId || 'dept').toLowerCase()}@jharkhand.gov.in`;

  const handleCopy = (text, field, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (onToast) onToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Official Portal Credentials (ID & Password)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Access credentials for Mukhiya / Department Head governance console login
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Credentials ✓</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Department ID / Login ID */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Department Login ID / Email
          </span>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="font-mono font-bold text-slate-900 text-xs break-all">{loginEmail}</span>
            <button
              type="button"
              onClick={() => handleCopy(loginEmail, 'id', 'Login ID')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs cursor-pointer shrink-0 transition-colors"
              title="Copy Login ID"
            >
              {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Portal UID: {deptId}</div>
        </div>

        {/* Access Password */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Access Key / Password
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
            >
              {showPassword ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-slate-500" />}
              <span>{showPassword ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
              {showPassword ? defaultPass : '••••••••••••'}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(defaultPass, 'pass', 'Password')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs cursor-pointer shrink-0 transition-colors"
              title="Copy Password"
            >
              {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-400">Default official access token</div>
        </div>
      </div>

      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 font-medium flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-950">Governance Note:</strong> This ID &amp; Password can be securely shared with the Gram Panchayat Mukhiya, Block Development Officer (BDO), or Nodal Officer to submit telemetry and review local challenges.
        </div>
      </div>
    </div>
  );
};

export default DepartmentCredentialsCard;
