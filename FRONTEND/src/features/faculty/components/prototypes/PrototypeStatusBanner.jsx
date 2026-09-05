import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const PrototypeStatusBanner = ({ currentStatus, needsChanges, isRejected, isCertified }) => {
  if (needsChanges) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl shadow-2xs text-left">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider">University Requested Revisions — Editor Unlocked</h3>
          <p className="text-[11px] font-medium opacity-90">Please update the prototype phases according to university evaluation directives and re-submit.</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-extrabold uppercase">Editable</span>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl shadow-2xs text-left">
        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider">Prototype Submission Rejected — Editor Unlocked</h3>
          <p className="text-[11px] font-medium opacity-90">The previous submission was rejected. You can edit the 4 phases and submit a fresh prototype blueprint.</p>
        </div>
        <span className="px-2.5 py-1 bg-rose-200 text-rose-900 rounded-lg text-[10px] font-extrabold uppercase">Editable</span>
      </div>
    );
  }

  if (isCertified) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-2xs text-left">
        <CheckCircle2 className="w-6 h-6 text-[#007A61] shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#007A61]">✓ Official State Certified (TRL-9) & Publicly Deployed</h3>
          <p className="text-[11px] font-medium text-emerald-900">Department of Higher & Technical Education (DHTE) validated all 4 stages. Citizen challenge is resolved.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-black">TRL-9 Certified</span>
      </div>
    );
  }

  if (currentStatus === 'Approved') {
    return (
      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-2xs text-left">
        <CheckCircle2 className="w-6 h-6 text-[#007A61] shrink-0" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider">Prototype Blueprint Approved by University</h3>
          <p className="text-[11px] font-medium opacity-90">Your prototype has been successfully approved by the University Authority and forwarded to Government for State TRL-9 certification.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PrototypeStatusBanner;
