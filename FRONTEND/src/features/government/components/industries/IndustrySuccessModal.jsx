import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Download, AlertTriangle, X } from 'lucide-react';

export const IndustrySuccessModal = ({ isOpen, onClose, credentials }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !credentials) return null;

  const { industryId, legalName, email, password } = credentials;

  const credentialsText = `=========================================
JOHARSETU JHARKHAND INDUSTRY ONBOARDING
=========================================
Organization Legal Name : ${legalName}
Industry Entity ID      : ${industryId}
Portal Login URL        : http://localhost:5173/login
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100 bg-emerald-50/50">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Industry Registered Successfully</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Login account and access keys have been provisioned in the database.
          </p>
        </div>

        {/* Credentials Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/90 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Entity ID</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {industryId}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Organization</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">{legalName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Login Email</span>
              <span className="font-mono font-semibold text-slate-800">{email}</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-medium">Temporary Password</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-300">
                {password}
              </span>
            </div>
          </div>

          {/* Security Advisory */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 text-amber-800 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Security Note:</strong> Save this temporary password securely. It will not be shown again in plaintext.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Credentials'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] text-white font-bold py-2.5 px-4 rounded text-xs transition-colors cursor-pointer"
          >
            Done & Return to Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySuccessModal;
