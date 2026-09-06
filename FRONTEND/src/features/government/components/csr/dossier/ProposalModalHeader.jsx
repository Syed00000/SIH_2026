import React from 'react';
import { ArrowLeft, X, Printer, FileText, Layers, IndianRupee, DollarSign, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'overview', label: '1. Executive Abstract', icon: FileText },
  { id: 'methodology', label: '2. Technical Architecture', icon: Layers },
  { id: 'budget', label: '3. DPR Budget Table', icon: IndianRupee },
  { id: 'payments', label: '4. Tranches & Payments', icon: DollarSign },
  { id: 'statutory', label: '5. Due Diligence & MoU', icon: ShieldCheck }
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
      <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 border-b border-slate-800">
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all border border-white/20 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-300" />
              <span>Back to Proposals</span>
            </button>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline uppercase tracking-wider">
              Department of Higher &amp; Technical Education • Government of Jharkhand
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
              {proposal.id}
            </span>
            <span className="font-extrabold text-xs text-slate-200">{proposal.institutionName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300">{proposal.sourceScheme}</span>
            {Number(proposal.additionalAmount) > 0 && (
              <span className="font-bold text-[10.5px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md">
                +₹ {Number(proposal.additionalAmount).toLocaleString('en-IN')} Extra Grant
              </span>
            )}
          </div>
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight line-clamp-1">
            {proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={handlePrintSanctionOrder}
            className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-white flex items-center space-x-1.5 text-xs font-bold cursor-pointer transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Sanction Order</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                  ? 'border-[#007A61] text-[#007A61] bg-white rounded-t-lg shadow-2xs'
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
