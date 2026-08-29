import React, { useState, useEffect } from 'react';
import { X, Landmark, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const EscrowVaultsModal = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());

  useEffect(() => {
    if (!isOpen) return;
    setProjects(projectCsrSyncService.getActiveProjects());
    setFinancials(projectCsrSyncService.getFinancials());
    const unsubscribe = projectCsrSyncService.subscribe(() => {
      setProjects(projectCsrSyncService.getActiveProjects());
      setFinancials(projectCsrSyncService.getFinancials());
    });
    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamically map projects to dedicated escrow accounts
  const vaults = projects.map((proj, idx) => {
    const bankNames = ['State Bank of India', 'Punjab National Bank', 'Bank of Baroda'];
    const bankName = bankNames[idx % bankNames.length];
    return {
      vaultId: `VLT-${proj.id.slice(-4)}`,
      bankName,
      branch: `${proj.district} Main Branch`,
      accountNumber: `3098210${idx}84${idx + 2}`,
      ifsc: idx % 2 === 0 ? 'SBIN0003425' : 'PUNB0121000',
      currentBalance: proj.disbursedGrant,
      lockedTranches: proj.sanctionedGrant,
      schemeMapped: `Societal R&D: ${proj.title}`,
      status: 'Active'
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <Landmark className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Dedicated Escrow Accounts & Bank Vaults</h3>
              <p className="text-xs text-slate-500 font-normal">{vaults.length} Dedicated Zero-Balance Escrow Vaults under State Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-white">
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Total Corpus in Vaults</span>
              <span className="text-base font-bold text-slate-900 block mt-1">₹{(financials.totalCorpus / 100000).toFixed(2)} Lakhs</span>
              <span className="text-[11px] text-slate-500 font-normal">State Innovation Pool</span>
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Available Liquid Balance</span>
              <span className="text-base font-bold text-slate-900 block mt-1">₹{(financials.availableCorpus / 100000).toFixed(2)} Lakhs</span>
              <span className="text-[11px] text-slate-500 font-normal">Unencumbered Escrow</span>
            </div>
            <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Locked in Tranches</span>
              <span className="text-base font-bold text-slate-900 block mt-1">₹{(financials.totalDisbursed / 100000).toFixed(2)} Lakhs</span>
              <span className="text-[11px] text-slate-500 font-normal">Milestone Allocated</span>
            </div>
          </div>

          {/* Accounts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Vault Registries</h4>
            <div className="space-y-3">
              {vaults.map((vault) => (
                <div
                  key={vault.vaultId}
                  className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50/60 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-slate-900 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{vault.bankName}</span>
                        <span className="text-[11px] text-slate-500 font-normal block">{vault.branch}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-900 border border-slate-200 self-start sm:self-auto">
                      <CheckCircle2 className="w-3 h-3 text-slate-900" />
                      <span>{vault.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Vault Code</span>
                      <span className="font-mono font-bold text-slate-900 block">{vault.vaultId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Account / IFSC</span>
                      <span className="font-mono font-medium text-slate-800 block text-[11px]">{vault.accountNumber} ({vault.ifsc})</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Available Liquid</span>
                      <span className="font-mono font-bold text-slate-900 block">{vault.currentBalance}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Locked in Milestones</span>
                      <span className="font-mono font-bold text-slate-900 block">{vault.lockedTranches}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 font-normal pt-1 border-t border-slate-55">
                    <strong>Mapped Scheme:</strong> {vault.schemeMapped}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2 text-[11px] text-slate-700 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
            <span>All Escrow accounts operate under an automatic tripartite lock-in agreement. No debit can occur without digital dual-key approval by the Department of Higher & Technical Education.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowVaultsModal;
