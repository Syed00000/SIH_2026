import React from 'react';
import { X, Landmark, ShieldCheck, Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MOCK_ESCROW_ACCOUNTS } from '../../data/mockCsrLifecycleData.js';

export const EscrowVaultsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dedicated Escrow Accounts & Bank Vaults</h3>
              <p className="text-[11px] text-slate-500 font-medium">12 Dedicated Zero-Balance SBI/BOI/PNB Escrow Vaults under State Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Corpus in Vaults</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">₹110.00 Cr</span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Available Liquid Balance</span>
              <span className="text-base font-extrabold text-emerald-900 block mt-0.5">₹60.45 Cr</span>
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">Locked in Tranches</span>
              <span className="text-base font-extrabold text-blue-900 block mt-0.5">₹49.55 Cr</span>
            </div>
          </div>

          {/* Accounts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Active Vault Registries</h4>
            <div className="space-y-3">
              {MOCK_ESCROW_ACCOUNTS.map((vault) => (
                <div
                  key={vault.vaultId}
                  className="p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50/60 transition-all space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{vault.bankName}</span>
                        <span className="text-[11px] text-slate-500 font-medium block">{vault.branch}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{vault.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Vault Code</span>
                      <span className="font-mono font-bold text-blue-600 block">{vault.vaultId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Account / IFSC</span>
                      <span className="font-mono font-semibold text-slate-800 block text-[11px]">{vault.accountNumber} ({vault.ifsc})</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Available Liquid</span>
                      <span className="font-mono font-bold text-emerald-700 block">{vault.currentBalance}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Locked in Milestones</span>
                      <span className="font-mono font-bold text-slate-900 block">{vault.lockedTranches}</span>
                    </div>
                  </div>

                  <div className="text-[10.5px] text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg">
                    <strong>Mapped Portfolio:</strong> {vault.schemeMapped}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2 text-[11px] text-slate-600 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>All Escrow accounts operate under an automatic tripartite lock-in agreement. No debit can occur without digital dual-key approval by the Department of Higher & Technical Education.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowVaultsModal;
