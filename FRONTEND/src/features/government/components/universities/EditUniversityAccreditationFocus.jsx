import React from 'react';
import { Award, Layers } from 'lucide-react';

export const EditUniversityAccreditationFocus = ({
  formData,
  onInputChange,
  onToggleFocusArea,
  focusAreaOptions = []
}) => {
  return (
    <div className="space-y-4 select-none">
      {/* 3. Accreditation & Ranking Card */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>3. Accreditation & Rankings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">NAAC Grade</label>
            <select
              value={formData.naacGrade}
              onChange={(e) => onInputChange('naacGrade', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="A++">A++</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B++">B++</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Non-Accredited">Non-Accredited</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Accreditation Validity</label>
            <input
              type="date"
              value={formData.naacValidity}
              onChange={(e) => onInputChange('naacValidity', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">NIRF Ranking</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={formData.nirfRanking}
              onChange={(e) => onInputChange('nirfRanking', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Focus Areas Checkbox Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>4. Research & Problem Focus Areas</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {focusAreaOptions.map((area) => {
            const isChecked = formData.focusAreas.includes(area);
            return (
              <label
                key={area}
                className={`flex items-center space-x-2 px-2.5 py-2 rounded-md border text-xs cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-blue-50/60 border-blue-300 text-blue-900 font-semibold shadow-2xs'
                    : 'bg-slate-50/40 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleFocusArea(area)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="truncate">{area}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditUniversityAccreditationFocus;
