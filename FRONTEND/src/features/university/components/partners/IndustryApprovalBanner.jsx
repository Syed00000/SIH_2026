import React, { useState } from 'react';
import { Lock, ShieldCheck, ChevronRight, X, Building2, Bell } from 'lucide-react';

export const IndustryApprovalBanner = ({
  approvedRequests = [],
  onSelectPartner,
  partners = []
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !approvedRequests.length) return null;

  const latest = approvedRequests[0];
  const partnerName = latest.partnerName || 'Industry Partner';
  const projectTitle = latest.projectTitle || 'Innovation Project';
  const budget = latest.estimatedBudget || 'Sanctioned Grant';

  const matchedPartner = partners.find((p) =>
    (p.partnerId && latest.partnerId && p.partnerId === latest.partnerId) ||
    (p._id && latest.partnerId && String(p._id) === String(latest.partnerId)) ||
    (p.name && latest.partnerName && p.name.toLowerCase() === latest.partnerName.toLowerCase()) ||
    (p.legalName && latest.partnerName && p.legalName.toLowerCase() === latest.partnerName.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-emerald-300/90 shadow-2xs select-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="h-1 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-emerald-400 w-full" />
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-[#007A61] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-700">
            <Building2 className="w-5 h-5 text-emerald-100" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#007A61] border border-white" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                <Bell className="w-3 h-3 text-[#007A61]" />
                <span>Industry Approval Notification</span>
              </span>
              <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#007A61]" />
                <span>Approved from Industry ({approvedRequests.length} Active)</span>
              </span>
            </div>

            <div className="mt-1">
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                {partnerName} has officially approved collaboration & lab access
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                Proposal &bull; <strong className="text-slate-800">"{projectTitle}"</strong> has been approved for budget {budget}. Industry testing laboratories and technical resources are now unlocked.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0 pt-1 md:pt-0">
          {matchedPartner && onSelectPartner && (
            <button
              type="button"
              onClick={() => onSelectPartner(matchedPartner)}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer border border-[#00604c]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>View Approved Dossier</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryApprovalBanner;
