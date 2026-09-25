import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Download, AlertTriangle, X } from 'lucide-react';

export const IndustrySuccessModal = ({ isOpen, onClose, credentials }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !credentials) return null;

  const { industryId, legalName, email, password } = credentials;

  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';

  const credentialsText = `=========================================
JOHARSETU JHARKHAND INDUSTRY ONBOARDING
=========================================
Organization Legal Name : ${legalName}
Industry Entity ID      : ${industryId}
Portal Login URL        : ${portalUrl}
Login Username / Email  : ${email}
Temporary Password      : ${password}
Account Status          : Active
Generated On            : ${new Date().toLocaleString()}
=========================================
NOTICE: Please change your password on first login.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(credentialsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([credentialsText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${industryId}_Credentials.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-tight">Industry Registered Successfully</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">Login account and access keys have been provisioned</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Credentials Card */}
        <div className="p-5 space-y-3.5 text-xs">
          <div className="bg-slate-50/70 p-3.5 rounded-md border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium text-[11px]">Entity ID</span>
              <span className="font-mono font-bold text-slate-900 text-xs select-all">
                {industryId}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium text-[11px]">Organization</span>
              <span className="font-bold text-slate-900 text-xs truncate max-w-[220px] text-right">{legalName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium text-[11px]">Login Email</span>
              <span className="font-mono font-bold text-slate-900 text-xs select-all truncate max-w-[220px]">{email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium text-[11px]">Temporary Password</span>
              <span className="font-mono font-bold text-slate-900 text-xs tracking-wider select-all">
                {password}
              </span>
            </div>
          </div>

          {/* Security Advisory */}
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-md flex items-start space-x-2 text-amber-900 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Important Security Note:</strong> Save this temporary password securely. It will not be shown again in plaintext.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-md text-xs transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy Credentials'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-md text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download File</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-[#0d1b3e] hover:bg-[#152754] text-white font-bold rounded-md text-xs transition-colors cursor-pointer shadow-xs"
          >
            Done & Return to Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySuccessModal;
