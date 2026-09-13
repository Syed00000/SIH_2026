import React from 'react';
import { Eye, Landmark, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const DepartmentAllocationTable = ({ allocations = [], onViewReceipt }) => {
  if (allocations.length === 0) {
    return (
      <div className="bg-white rounded-xs p-12 text-center border border-slate-200 text-slate-400 shadow-xs space-y-2">
        <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
        <div className="text-xs font-bold text-slate-700">No Department Fund Allocations Found</div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
          No funds have been transferred to state departments matching the search criteria. Click "+ Allocate Fund to Department" above to disburse state grant funds.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xs shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3.5">Sanction Order / Fund ID</th>
              <th className="py-3 px-3.5">Target Department</th>
              <th className="py-3 px-3.5 text-right">Allocated Amount</th>
              <th className="py-3 px-3.5">Scheme / Head</th>
              <th className="py-3 px-3.5">Allocation Date</th>
              <th className="py-3 px-3.5">Sanction Authority</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {allocations.map((item) => {
              const amountNum = Number(item.amount) || 0;
              const formattedDate = item.allocationDate
                ? new Date(item.allocationDate).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })
                : 'N/A';

              return (
                <tr key={item.fundId || item._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                      {item.sanctionOrderNo || item.fundId}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Ref: {item.fundId}
                    </div>
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{item.department}</div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs">
                        {item.departmentCategory || 'State Department'}
                      </span>
                      {item.departmentId && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.departmentId}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="font-black font-mono text-emerald-800 text-sm">
                      ₹ {amountNum.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500">
                      FY {item.financialYear || '2026-2027'}
                    </div>
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="font-medium text-slate-800 max-w-xs truncate" title={item.scheme}>
                      {item.scheme}
                    </div>
                    {item.description && (
                      <div className="text-[10px] text-slate-400 truncate max-w-xs" title={item.description}>
                        {item.description}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-slate-600 font-medium">
                    {item.allocatedBy || 'Govt of Jharkhand'}
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#007A61] border border-emerald-300 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Transferred</span>
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewReceipt(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xs text-[11px] font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Order</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentAllocationTable;
