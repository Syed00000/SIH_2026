import React from 'react';
import { Award } from 'lucide-react';

export const AddUniversityStepAccreditation = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <Award className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 3: Accreditation & Rankings</h2>
          <p className="text-[10px] text-slate-400 font-medium">Capture NAAC accreditation status and national ranking indicators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">NAAC Grade</label>
          <select
            value={formData.naacGrade}
            onChange={(e) => onInputChange('naacGrade', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
          >
            <option value="A++">A++</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B++">B++</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="Non-Accredited">Non-Accredited / Under Evaluation</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Accreditation Validity</label>
          <input
            type="date"
            value={formData.naacValidity}
            onChange={(e) => onInputChange('naacValidity', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">NIRF Ranking (Optional)</label>
          <input
            type="number"
            value={formData.nirfRanking}
            onChange={(e) => onInputChange('nirfRanking', e.target.value)}
            placeholder="e.g. 45"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default AddUniversityStepAccreditation;
