import React, { useState } from 'react';
import { X, Send, Landmark, Zap } from 'lucide-react';

const ESCROW_VAULT_OPTIONS = [
  { id: 'VAULT-SBI-01', bank: 'State Bank of India (SBI)', accountNo: 'SBI-ESCROW-98214' },
  { id: 'VAULT-PNB-02', bank: 'Punjab National Bank (PNB)', accountNo: 'PNB-CSR-44129' }
];

const DISBURSAL_MODES = [
  { id: 'PFMS Direct Node', label: 'PFMS Direct Node (Govt PFMS API)' },
  { id: 'RBI RTGS Bulk', label: 'RBI RTGS Bulk Node' },
  { id: 'NEFT Treasury Batch', label: 'NEFT Treasury Batch Node' },
  { id: 'Instant UPI Gov Gateway', label: 'Instant UPI Gov Gateway' }
];

export const InitiateDisbursalModal = ({
  isOpen,
  onClose,
  proposals = [],
  onDisbursalCreated,
  initialProposal = null
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState(
    initialProposal ? initialProposal.id : (proposals[0]?.id || 'PROP-011')
  );
  const [vaultId, setVaultId] = useState('VAULT-SBI-01');
  const [grossAmount, setGrossAmount] = useState(250000);
  const [tdsType, setTdsType] = useState('194C');
  const [mode, setMode] = useState('PFMS Direct Node');
  const [purpose, setPurpose] = useState('Tranche 1 Grant: Equipment & Prototype Setup');

  if (!isOpen) return null;

  const currentProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];
  const tdsPercent = tdsType === '194C' ? 0.02 : 0.10;
  const tdsAmount = Math.round(grossAmount * tdsPercent);
  const netAmount = grossAmount - tdsAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grossAmount || grossAmount <= 0) {
      alert('Please enter a valid disbursement amount');
      return;
    }

    const utrPrefix = mode.includes('UPI') ? 'UPI' : mode.includes('PFMS') ? 'PFMS' : mode.includes('RTGS') ? 'RBI' : 'NEFT';
    const newPayment = {
      id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
      payer: currentProposal ? `${currentProposal.donor || 'Jharkhand State CSR Escrow'}` : 'Jharkhand State CSR Escrow',
      payee: currentProposal ? currentProposal.institutionName : 'Ranchi University',
      disbursedAmount: `₹${grossAmount.toLocaleString('en-IN')}`,
      mode: mode,
      utrNumber: `${utrPrefix}-UTR-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      makerCheckerSign: 'Cleared & Authenticated by Nodal Officer',
      makerCheckerStatus: 'approved',
      bankAckStatus: 'Acknowledged',
      bankStatus: 'ack',
      timestamp: new Date().toLocaleString('en-IN'),
      projectRef: selectedProposalId,
      tdsAmount: `₹${tdsAmount.toLocaleString('en-IN')} (${tdsType})`,
      netDisbursed: `₹${netAmount.toLocaleString('en-IN')}`,
      purpose: purpose
    };

    onDisbursalCreated?.(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Initiate Grant Disbursal</h3>
              <p className="text-[11px] text-slate-500 font-medium">Execute secure PFMS / RTGS / UPI grant transfer with statutory TDS deduction</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Project Proposal</label>
            <select
              value={selectedProposalId}
              onChange={(e) => setSelectedProposalId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.title || p.projectName} ({p.hei || p.institutionName || 'HEI'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Source Escrow Vault</label>
              <select
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                {ESCROW_VAULT_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>{v.bank} ({v.accountNo})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Channel Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                {DISBURSAL_MODES.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Gross Disbursal Amount (₹)</label>
            <input
              type="number"
              min="1000"
              value={grossAmount}
              onChange={(e) => setGrossAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-slate-600">Gross Tranche:</span><span className="font-mono font-bold text-slate-900">₹{grossAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">TDS Deduction ({tdsType === '194C' ? '2%' : '10%'}):</span><span className="font-mono font-bold text-rose-600">- ₹{tdsAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between border-t border-blue-200/60 pt-1"><span className="font-bold text-slate-900">Net University Credit:</span><span className="font-mono font-black text-emerald-700">₹{netAmount.toLocaleString('en-IN')}</span></div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-2xs">
              <Send className="w-3.5 h-3.5" />
              <span>Authorize Disbursal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiateDisbursalModal;
