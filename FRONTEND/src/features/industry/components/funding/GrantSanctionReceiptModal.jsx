import React from 'react';
import { X, CheckCircle2, Printer, Download, Building2, Landmark, ShieldCheck, FileCheck2 } from 'lucide-react';

export const GrantSanctionReceiptModal = ({ isOpen, onClose, receiptData, user }) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = Number(receiptData.amount || 0);
  const formattedAmount = `₹ ${amount.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black tracking-wider uppercase">Official Grant Disbursal Sanction Receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 bg-white space-y-6 text-slate-800">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wider uppercase">
                  JOHARSETU ESCROW SETTLED
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  TX: {receiptData.disbursementId || receiptData.id || 'IND-DISB-001'}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">Industry Research Grant Sanction Order</h1>
              <p className="text-xs text-slate-500 font-medium">Department of Higher & Technical Education, Government of Jharkhand</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#007A61] block">{user?.organizationName || receiptData.industryName || 'Ariba Research Labs'}</span>
              <span className="text-[10px] text-slate-400 font-mono">Date: {new Date(receiptData.disbursedAt || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Key Grant Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Sanctioned Amount</span>
              <span className="text-base font-black text-emerald-700">{formattedAmount}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Settlement Mode</span>
              <span className="text-xs font-bold text-slate-900">{receiptData.mode || 'Direct Corporate Escrow'}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">UTR / Escrow Ref</span>
              <span className="text-xs font-mono font-bold text-slate-800 truncate block">{receiptData.utrNumber}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Status</span>
              <span className="inline-flex items-center text-xs font-extrabold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Credited
              </span>
            </div>
          </div>

          {/* University and Project Details */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Beneficiary Institution (HEI):</span>
              <span className="font-black text-slate-900 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {receiptData.universityName} ({receiptData.universityCode || 'HEI'})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Project / Technology Title:</span>
              <span className="font-extrabold text-slate-900">{receiptData.projectTitle}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Debited Corporate Fund Pool:</span>
              <span className="font-bold text-slate-800">{receiptData.fundTitle || 'Corporate Innovation Pool'} ({receiptData.category || 'Prototype Funding'})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">Grant Purpose:</span>
              <span className="font-medium text-slate-700">{receiptData.purpose || 'R&D Component Prototyping and Fabrication Grant'}</span>
            </div>
          </div>

          {/* Escrow Seal Verification Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-emerald-700 text-xs font-black">
                <FileCheck2 className="w-4 h-4" />
                <span>Digitally Verified by JoharSetu Nodal Escrow</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()} • Time: {new Date().toISOString()}
              </p>
            </div>
            <div className="w-20 h-16 border-2 border-emerald-600/30 rounded-lg flex flex-col items-center justify-center p-1 text-center bg-emerald-50/50">
              <span className="text-[8px] font-black text-emerald-800 uppercase leading-tight">SANCTIONED & SETTLED</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 my-0.5" />
              <span className="text-[7px] font-mono text-emerald-700 font-bold">GOVT ESCROW</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantSanctionReceiptModal;
