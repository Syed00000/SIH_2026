import React from 'react';
import { X, Printer, CheckCircle2, FileText, Landmark } from 'lucide-react';

export const DepartmentSanctionReceiptModal = ({ isOpen, onClose, allocation }) => {
  if (!isOpen || !allocation) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountNumber = Number(allocation.amount) || 0;
  const formattedDate = allocation.allocationDate
    ? new Date(allocation.allocationDate).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span className="font-black text-xs uppercase tracking-wider">Government Sanction Order Receipt</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3 text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#007A61]">Government of Jharkhand</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">Department Budgetary Sanction Order</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Order No: {allocation.sanctionOrderNo || allocation.fundId}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xs border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Recipient Department</span>
              <span className="text-xs font-black text-slate-900 block">{allocation.department}</span>
              <span className="text-[10px] font-medium text-slate-500">{allocation.departmentCategory || 'State Department'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Allocation Date</span>
              <span className="text-xs font-bold text-slate-800 block">{formattedDate}</span>
              <span className="text-[10px] font-mono text-slate-500">FY: {allocation.financialYear || '2026-2027'}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#007A61] block">Sanctioned Grant Amount</span>
              <span className="text-xl font-black font-mono text-emerald-900">₹ {amountNumber.toLocaleString('en-IN')}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sanctioned & Credited</span>
            </span>
          </div>

          <div className="space-y-2 text-slate-700">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Scheme / Head</span>
              <span className="font-semibold text-slate-900">{allocation.scheme || 'State Innovation Allocation'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Sanctioning Authority</span>
              <span className="font-medium text-slate-800">{allocation.allocatedBy || 'Super Admin, Govt of Jharkhand'}</span>
            </div>
            {allocation.description && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Remarks</span>
                <span className="text-slate-600 italic">{allocation.description}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={handlePrint} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white font-bold rounded-xs cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSanctionReceiptModal;
