import React from 'react';
import { X, Landmark, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const ESCROW_VAULTS = [
  { id: 'VAULT-01', bank: 'State Bank of India (SBI)', accountNo: 'SBI-ESCROW-98214', balanceCr: '₹ 45.20 Cr', status: 'Active', interestAccrued: '₹ 42.5 Lakhs' },
  { id: 'VAULT-02', bank: 'Punjab National Bank (PNB)', accountNo: 'PNB-CSR-44129', balanceCr: '₹ 28.30 Cr', status: 'Active', interestAccrued: '₹ 21.0 Lakhs' }
];

export const EscrowVaultsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dedicated Escrow Accounts & Bank Vaults</h3>
              <p className="text-[11px] text-slate-500 font-medium">Dedicated Zero-Balance SBI/PNB Escrow Vaults under State Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {ESCROW_VAULTS.map((vault) => (
              <div key={vault.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{vault.bank}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                    {vault.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500">{vault.accountNo}</div>
                <div className="text-lg font-black text-slate-900">{vault.balanceCr}</div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Interest Accrued: {vault.interestAccrued}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowVaultsModal;
