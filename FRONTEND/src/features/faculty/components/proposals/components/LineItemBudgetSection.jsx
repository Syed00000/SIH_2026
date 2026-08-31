import React from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { PRESET_CATEGORIES } from '../presets/proposalPresets.js';

export const LineItemBudgetSection = ({
  budgetItems = [],
  totalCalculatedBudget = 0,
  onAddItem,
  onQuickAdd,
  onRemoveItem,
  onUpdateItem
}) => {
  return (
    <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3.5">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Line-Item Budget Breakdown ({budgetItems.length} Items)
            </h3>
            <span className="text-[10px] text-slate-500">
              Specify exact research headings, hardware costs & field allocations
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            Total Grant Requested
          </span>
          <span className="text-base font-black font-mono text-[#007A61]">
            ₹ {totalCalculatedBudget.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Quick Add Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Quick Preset Headings:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_CATEGORIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onQuickAdd(preset)}
              className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Items List */}
      <div className="space-y-2 pt-1">
        {budgetItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono font-bold text-[10.5px] flex items-center justify-center shrink-0">
              #{idx + 1}
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                required
                value={item.title}
                onChange={(e) => onUpdateItem(item.id, 'title', e.target.value)}
                placeholder="e.g. Field Telemetry Sensors & Hardware Modules"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <div className="w-32 shrink-0 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                required
                min="0"
                value={item.amount}
                onChange={(e) => onUpdateItem(item.id, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              disabled={budgetItems.length <= 1}
              className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-1 flex justify-start">
        <button
          type="button"
          onClick={onAddItem}
          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Add Custom Budget Line Item</span>
        </button>
      </div>
    </div>
  );
};

export default LineItemBudgetSection;
