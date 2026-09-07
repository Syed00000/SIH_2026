import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Copy, Check, ShieldCheck, Mail } from 'lucide-react';

export const DepartmentCredentialsCard = ({ department }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!department) return null;

  const deptId = department.deptId || department.id || department._id;
  const deptDigits = (deptId || '').replace(/\D/g, '') || '2026';
  const defaultPass = department.credentials?.password || department.credentials?.generatedPassword || `Dept@JH${deptDigits}!`;
  const loginEmail = department.credentials?.loginEmail || department.headEmail || `${(deptId || 'dept').toLowerCase()}@jharkhand.gov.in`;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Official Portal Credentials (ID & Password)</h2>
            <p className="text-[11px] text-slate-500 font-medium">Access credentials for Mukhiya / Department Head login</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Active Credentials</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Department ID / Login ID */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department Login ID / Email</span>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="font-mono font-bold text-slate-900 text-xs break-all">{loginEmail}</span>
            <button
              type="button"
              onClick={() => handleCopy(loginEmail, 'id')}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer shrink-0"
              title="Copy Login ID"
            >
              {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Portal ID: {deptId}</div>
        </div>

        {/* Access Password */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access Key / Password</span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPassword ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
              {showPassword ? defaultPass : '••••••••••••'}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(defaultPass, 'pass')}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer shrink-0"
              title="Copy Password"
            >
              {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-400">Default official access token</div>
        </div>
      </div>

      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-[11px] text-amber-800 font-medium">
        <strong>Governance Note:</strong> This ID & Password can be shared with the Gram Panchayat Mukhiya, Block Development Officer (BDO), or Nodal Officer to submit telemetry and review local challenges.
      </div>
    </div>
  );
};

export default DepartmentCredentialsCard;
