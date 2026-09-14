import React from 'react';
import { ArrowLeft, X, Printer, FileText, Layers, IndianRupee, DollarSign, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Executive Summary', icon: FileText },
  { id: 'methodology', label: 'Technical Scope & Methodology', icon: Layers },
  { id: 'budget', label: 'DPR Line-Item Budget', icon: IndianRupee },
  { id: 'payments', label: 'Tranches & PFMS Disbursals', icon: DollarSign },
  { id: 'statutory', label: 'Statutory & Governance', icon: ShieldCheck }
];

export const ProposalModalHeader = ({
  proposal,
  onClose,
  handlePrintSanctionOrder,
  activeSubTab,
  setActiveSubTab
}) => {
  return (
    <>
      <div className="px-6 py-4 bg-white text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 border-b border-slate-200">
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#007A61]" />
              <span>Back to Proposals</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline uppercase tracking-wider">
              Department of Higher &amp; Technical Education • Government of Jharkhand
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-emerald-50 text-[#007A61] border border-emerald-300 rounded-md">
              {proposal.id}
            </span>
            <span className="font-extrabold text-xs text-slate-800">{proposal.institutionName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-semibold">{proposal.sourceScheme}</span>
            {Number(proposal.additionalAmount) > 0 && (
              <span className="font-bold text-[10.5px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-md">
                +₹ {Number(proposal.additionalAmount).toLocaleString('en-IN')} Extra Grant
              </span>
            )}
          </div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight line-clamp-1">
            {proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={handlePrintSanctionOrder}
            className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 flex items-center space-x-1.5 text-xs font-bold cursor-pointer transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#007A61]" />
            <span className="hidden sm:inline">Sanction Order</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50/70 text-xs font-semibold overflow-x-auto gap-2">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap text-xs font-bold -mb-px ${
                isActive
                  ? 'border-[#007A61] text-[#007A61] bg-white rounded-t-sm shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#007A61]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProposalModalHeader;
