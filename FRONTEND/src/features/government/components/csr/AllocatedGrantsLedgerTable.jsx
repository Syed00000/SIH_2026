import React from 'react';
import { FileCheck2, Landmark, Plus, Edit3 } from 'lucide-react';

export const AllocatedGrantsLedgerTable = ({
  fundEntries = [],
  formatLakhsCrSubtitle,
  onOpenAddModal,
  onEditFund
}) => {
  return (
    <div className="pt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Allocated State Grants Ledger ({fundEntries.length})
          </h4>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Click <strong>Edit</strong> to modify or rectify any allocated grant
        </span>
      </div>

      {fundEntries.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
          <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-xs font-bold text-slate-700">No State Grant Allocations Yet</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Click "+ Allocate State Grant Fund" to add budgetary funds from the Department of Higher Education or State Innovation Council.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-2 px-3.5 py-1.5 bg-[#007A61] text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Allocation</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Fund ID / G.O. Ref</th>
                <th className="py-2.5 px-3">Grant Title & Scheme</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Allocation Date</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {fundEntries.map((f) => {
                const amtNumber = Number(f.amount) || 0;
                return (
                  <tr key={f.fundId || f._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/70">
                        {f.fundId || 'GGF-001'}
                      </span>
                      {f.sanctionOrderNo && (
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {f.sanctionOrderNo}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{f.title}</div>
                      <div className="text-[10.5px] text-slate-500 line-clamp-1">{f.scheme}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {f.department}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {f.allocationDate ? new Date(f.allocationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="font-black font-mono text-slate-900 text-sm">
                        ₹ {amtNumber.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-bold text-[#007A61]">
                        {formatLakhsCrSubtitle(amtNumber)}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onEditFund(f)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit / Rectify</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllocatedGrantsLedgerTable;
