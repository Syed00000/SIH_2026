import React from 'react';
import { X, Printer, FileText, Layers, IndianRupee, DollarSign, ShieldCheck } from 'lucide-react';

export const ProposalModalHeader = ({
  proposal,
  onClose,
  handlePrintSanctionOrder,
  activeSubTab,
  setActiveSubTab
}) => {
  return (
    <>
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex-1 pr-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono font-black text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
              {proposal.id}
            </span>
            <span className="font-bold text-xs text-slate-200">{proposal.institutionName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300">{proposal.sourceScheme}</span>
            {Number(proposal.additionalAmount) > 0 && (
              <span className="font-bold text-[10.5px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md">
                +₹ {Number(proposal.additionalAmount).toLocaleString('en-IN')} Extra Grant
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 font-medium line-clamp-1">
            {proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
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
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-white text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: '1. Executive Abstract', icon: FileText },
          { id: 'methodology', label: '2. Technical Architecture', icon: Layers },
          { id: 'budget', label: '3. DPR Budget Table', icon: IndianRupee },
          { id: 'payments', label: '4. Tranches & Payments', icon: DollarSign },
          { id: 'statutory', label: '5. Due Diligence & MoU', icon: ShieldCheck }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-3 px-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap text-xs font-bold ${
                isActive
                  ? 'border-[#007A61] text-[#007A61]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProposalModalHeader;
