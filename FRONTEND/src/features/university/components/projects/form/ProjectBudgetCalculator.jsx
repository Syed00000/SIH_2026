import React from 'react';
import { Calculator } from 'lucide-react';

export const ProjectBudgetCalculator = ({
  hardwareCost,
  setHardwareCost,
  fabCost,
  setFabCost,
  fieldCost,
  setFieldCost,
  overheadCost,
  setOverheadCost,
  totalBudget
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4.5 space-y-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Line-Item Budget Breakdown &amp; Grant Estimator
          </h2>
        </div>
        <div className="text-xs font-mono font-bold text-[#007A61] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          Total: ₹ {totalBudget.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">Hardware &amp; Microcontrollers (₹)</label>
          <input
            type="number"
            value={hardwareCost}
            onChange={(e) => setHardwareCost(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] font-mono shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">Lab &amp; Prototype Fabrication (₹)</label>
          <input
            type="number"
            value={fabCost}
            onChange={(e) => setFabCost(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] font-mono shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">Field Testing &amp; Calibration (₹)</label>
          <input
            type="number"
            value={fieldCost}
            onChange={(e) => setFieldCost(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] font-mono shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">Institutional Overhead &amp; Fellowship (₹)</label>
          <input
            type="number"
            value={overheadCost}
            onChange={(e) => setOverheadCost(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] font-mono shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBudgetCalculator;
