import React, { useState } from 'react';
import { CheckCircle2, KeyRound, RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react';

export const AddUniversityStepReview = ({
  formData,
  onGeneratePassword,
  loginEmail
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.initialPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 6: Review & Credentials Generation</h2>
          <p className="text-[10px] text-slate-400 font-medium">Verify all entered institutional details and generate login credentials.</p>
        </div>
      </div>

      {/* Credentials Card */}
      <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">HEI Login Credentials</h3>
          </div>
          <button
            type="button"
            onClick={onGeneratePassword}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Regenerate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-md p-2.5 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-medium block">Login ID / Email</span>
            <span className="text-xs font-bold text-slate-900 select-all font-mono">{loginEmail}</span>
          </div>

          <div className="bg-white rounded-md p-2.5 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Generated Password</span>
              <span className="text-xs font-mono font-bold text-slate-900 select-all">
                {showPassword ? formData.initialPassword : '••••••••••••'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                title="Copy Password"
              >
                {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50/60 p-3.5 rounded-md border border-slate-200 space-y-1.5">
          <span className="font-bold text-slate-900 block pb-1 border-b border-slate-200">University Details</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Name:</span>
            <span className="font-bold text-slate-800">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Code:</span>
            <span className="font-mono font-bold text-slate-800">{formData.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Type:</span>
            <span className="font-medium text-slate-800">{formData.universityType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">District:</span>
            <span className="font-medium text-slate-800">{formData.district}</span>
          </div>
        </div>

        <div className="bg-slate-50/60 p-3.5 rounded-md border border-slate-200 space-y-1.5">
          <span className="font-bold text-slate-900 block pb-1 border-b border-slate-200">Nodal Officer</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Name:</span>
            <span className="font-bold text-slate-800">{formData.nodalOfficerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Designation:</span>
            <span className="font-medium text-slate-800">{formData.nodalOfficerDesignation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="font-medium text-slate-800">{formData.nodalOfficerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Phone:</span>
            <span className="font-medium text-slate-800">{formData.nodalOfficerPhone || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUniversityStepReview;
