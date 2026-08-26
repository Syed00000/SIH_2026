import React from 'react';
import { Layers } from 'lucide-react';

export const AddUniversityStepFocus = ({
  formData,
  onToggleFocusArea,
  focusAreaOptions = []
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <Layers className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 4: Research Focus Areas</h2>
          <p className="text-[10px] text-slate-400 font-medium">Select the problem sectors and domains this university can research.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {focusAreaOptions.map((area) => {
          const isChecked = formData.focusAreas.includes(area);
          return (
            <label
              key={area}
              className={`flex items-center space-x-2 px-2.5 py-2 rounded-md border text-xs cursor-pointer transition-all ${
                isChecked
                  ? 'bg-slate-100 border-slate-900 text-slate-900 font-bold shadow-2xs'
                  : 'bg-slate-50/40 border-slate-200 text-slate-700 hover:bg-slate-100/70'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleFocusArea(area)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer accent-slate-900"
              />
              <span className="truncate">{area}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AddUniversityStepFocus;
