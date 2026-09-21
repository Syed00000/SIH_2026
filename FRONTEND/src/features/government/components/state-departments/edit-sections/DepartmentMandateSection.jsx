import React from 'react';
import { FileText } from 'lucide-react';

export const DepartmentMandateSection = ({
  formData,
  handleChange,
  handleKeyFunctionChange,
  addKeyFunction,
  removeKeyFunction
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">3. Mandate & Functions</h3>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Department Objective / Mandate
          </label>
          <textarea
            name="mandate.objective"
            rows={2}
            placeholder="Primary objective of the department..."
            value={formData.mandate.objective}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Key Functions
          </label>
          <div className="space-y-2">
            {formData.keyFunctions.map((func, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={func}
                  onChange={(e) => handleKeyFunctionChange(index, e.target.value)}
                  placeholder="e.g. Policy formulation, monitoring..."
                  className="flex-1 px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-lg outline-none text-xs text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeKeyFunction(index)}
                  className="px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKeyFunction}
              className="text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer"
            >
              + Add Key Function
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
